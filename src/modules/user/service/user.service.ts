import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'
import { CreateUserDto, LoginDto, ResendOtpDto, VerifyOtpDto } from '../dto/user.dto'
import { REPOSITORY } from 'src/constant'
import { Repository } from 'typeorm'
import { User } from 'src/modules/database/entity/user'
import { OtpService } from '../otp/otp.service'
import { ResendOtpResponse, SigninResponse, SignupResponse, VerifyOtpResponse } from '../user.interface'
import { AuthService } from 'src/modules/auth/service/auth.service'

@Injectable()
export class UserService {
    constructor(
        @Inject(REPOSITORY.USER_REPOSITORY) private userRepo: Repository<User>,
        private readonly otpService: OtpService,
        private readonly authService: AuthService,
    ) {}
    async createUser(obj: CreateUserDto): Promise<SignupResponse> {
        try {
            const existedUser = await this.userRepo.findOne({
                where: [{ email: obj.email }, { username: obj.username }],
            })

            if (existedUser) {
                throw new HttpException('User already exists', HttpStatus.CONFLICT)
            }

            const hash = await bcrypt.hash(obj.password, 10)
            obj.password = hash

            const user = new User()
            Object.assign(user, obj)
            const savedUser = await this.userRepo.save(user)

            this.otpService.generateOtp(savedUser.id)
            return { message: 'User register succfully, and otp sent to your email' }
        } catch (err) {
            // If it's an HTTP exception, rethrow it directly.
            if (err instanceof HttpException) {
                throw err
            }
            // Log and throw a meaningful HTTP exception instead of a generic Error.
            console.error(err) // Log the error for debugging purposes.
            throw new HttpException('Failed to create user due to internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async verify(obj: VerifyOtpDto): Promise<VerifyOtpResponse> {
        try {
            const user = await this.userRepo.findOne({ where: { email: obj.email } })
            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND)
            }
            if (user.isVerified) {
                throw new HttpException('User already verified', HttpStatus.CONFLICT)
            }
            await this.otpService.isVerifiedOtp({ userId: user.id, code: obj.code })

            user.isVerified = true
            await this.userRepo.save(user)

            return { message: 'User successfully verified' }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err
            }
            throw new HttpException('Failed to create user due to internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async resend(data: ResendOtpDto): Promise<ResendOtpResponse> {
        try {
            const user = await this.userRepo.findOne({ where: { email: data.email } })
            if (!user) {
                throw new HttpException('Email not found', HttpStatus.CONFLICT)
            }
            this.otpService.generateOtp(user.id)
            return { message: 'Otp sent you your email' }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err
            }
            throw new HttpException('Failed to create user due to internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async signin(obj: LoginDto): Promise<SigninResponse> {
        try {
            const user = await this.userRepo.findOne({ where: { email: obj.email } })
            if (!user) {
                throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED)
            }

            if (!user.isVerified) {
                throw new HttpException('Your account not verified yet', HttpStatus.BAD_REQUEST)
            }

            const match = await bcrypt.compare(obj.password, user.password)
            if (!match) {
                throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED)
            }
            user.isActive = true
            await this.userRepo.save(user)
            const userObj = { ...user }
            delete userObj.password

            const token = await this.authService.generateToken(userObj)
            const response: SigninResponse = { user: userObj, token }
            return response
        } catch (err) {
            // If it's an HTTP exception, rethrow it directly.
            if (err instanceof HttpException) {
                throw err
            }
            throw new HttpException('Failed to create user due to internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}

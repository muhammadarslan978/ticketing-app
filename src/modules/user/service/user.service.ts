import { ConflictException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'

import { CreateUserDto } from '../dto/user.dto'
import { promises } from 'dns'
import { REPOSITORY } from 'src/constant'
import { Repository } from 'typeorm'
import { User } from 'src/modules/database/entity/user'
import { OtpService } from '../otp/otp.service'

@Injectable()
export class UserService {
    constructor(
        @Inject(REPOSITORY.USER_REPOSITORY) private userRepo: Repository<User>,
        private readonly otpService: OtpService,
    ) {}
    async createUser(obj: CreateUserDto): Promise<any> {
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
            return savedUser
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

    async signin(obj: CreateUserDto): Promise<any> {}
}

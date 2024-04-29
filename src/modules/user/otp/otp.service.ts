import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { REPOSITORY } from 'src/constant'
import { Otp } from 'src/modules/database/entity/otp'
import { MoreThan, Repository } from 'typeorm'
import { OtpInputDto } from '../dto/user.dto'

@Injectable()
export class OtpService {
    constructor(@Inject(REPOSITORY.OTP_REPOSITORY) private otpRepo: Repository<Otp>) {}

    generateRandomSixDigitNumber(): number {
        return Math.floor(100000 + Math.random() * 900000)
    }

    async generateOtp(userId: string): Promise<void> {
        try {
            const checkPreviousOtp = await this.otpRepo.find({ where: { userId: userId } })
            if (checkPreviousOtp.length) {
                for (const otp of checkPreviousOtp) {
                    await this.otpRepo.remove(otp)
                }
            }
            const oneHourLatter = new Date() // Get the current date and time
            oneHourLatter.setHours(oneHourLatter.getHours() + 1)

            const otp = new Otp()
            Object.assign(otp, {
                userId: userId,
                otpCode: this.generateRandomSixDigitNumber(),
                expirationTime: oneHourLatter,
            })
            const savedOtp = await this.otpRepo.save(otp)
            console.log(savedOtp)
        } catch (err) {
            if (err instanceof HttpException) {
                throw err
            }
            throw new HttpException('Failed to create user due to internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    async isVerifiedOtp(data: OtpInputDto): Promise<boolean> {
        try {
            const currentTime = new Date()

            const otp = await this.otpRepo.findOne({
                where: {
                    userId: data.userId,
                    isUsed: false,
                    otpCode: data.code,
                    expirationTime: MoreThan(currentTime),
                },
            })

            if (!otp) {
                throw new HttpException('OTP is invalid or has expired.', HttpStatus.BAD_REQUEST)
            }

            otp.isUsed = true
            await this.otpRepo.save(otp)
            return true
        } catch (err) {
            if (err instanceof HttpException) {
                throw err
            }
            throw new HttpException('Failed to verify OTP due to internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}

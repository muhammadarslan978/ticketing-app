import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { REPOSITORY } from 'src/constant'
import { Otp } from 'src/modules/database/entity/otp'
import { MoreThan, Repository } from 'typeorm'
import * as moment from 'moment'
import { OtpInputDto } from '../dto/user.dto'

@Injectable()
export class OtpService {
    constructor(@Inject(REPOSITORY.OTP_REPOSITORY) private otpRepo: Repository<Otp>) {}

    generateRandomSixDigitNumber(): number {
        console.log('otp code', Math.floor(100000 + Math.random() * 900000))
        return Math.floor(100000 + Math.random() * 900000)
    }

    async generateOtp(userId: string): Promise<void> {
        try {
            const now = moment()
            const oneHourLatter = now.add('1', 'hours')
            const otp = new Otp()
            Object.assign(otp, {
                userId: userId,
                otpCode: this.generateRandomSixDigitNumber,
                expirationTime: oneHourLatter,
            })
            await this.otpRepo.save(otp)
        } catch (err) {
            // If it's an HTTP exception, rethrow it directly.
            if (err instanceof HttpException) {
                throw err
            }
            throw new HttpException('Failed to create user due to internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async isVarifiedOtp(data: OtpInputDto): Promise<boolean> {
        try {
            const currentTime = new Date()
            const otp = await this.otpRepo.findOne({
                where: {
                    // userId: data.id,
                    // otpCode: data.code,
                    // isUsed: false,
                    // expirationTime: MoreThan(currentTime), // 'MoreThan' is used to check dates in the future
                },
            })

            console.log(otp)

            if (!otp) {
                throw new HttpException('OTP is invalid or has expired.', HttpStatus.BAD_REQUEST)
            }

            // Mark OTP as used after validation to prevent reuse
            otp.isUsed = true
            await this.otpRepo.save(otp)

            return true
        } catch (err) {
            // If it's an HTTP exception, rethrow it directly.
            if (err instanceof HttpException) {
                throw err
            }
            throw new HttpException('Failed to create user due to internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}

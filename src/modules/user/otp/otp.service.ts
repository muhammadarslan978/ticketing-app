import { Inject, Injectable } from '@nestjs/common'
import { REPOSITORY } from 'src/constant'
import { Otp } from 'src/modules/database/entity/otp'
import { Repository } from 'typeorm'
import * as moment from 'moment'

@Injectable()
export class OtpService {
    constructor(@Inject(REPOSITORY.OTP_REPOSITORY) private otpRepo: Repository<Otp>) {}

    generateRandomSixDigitNumber(): number {
        console.log('otp code', Math.floor(100000 + Math.random() * 900000))
        return Math.floor(100000 + Math.random() * 900000)
    }

    async generateOtp(userId: string): Promise<any> {
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
            throw new Error(err.message)
        }
    }
}

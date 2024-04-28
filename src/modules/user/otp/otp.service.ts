import { Inject, Injectable } from '@nestjs/common'
import { REPOSITORY } from 'src/constant'
import { Otp } from 'src/modules/database/entity/otp'
import { Repository } from 'typeorm'

@Injectable()
export class OtpService {
    constructor(@Inject(REPOSITORY.USER_REPOSITORY) private otpRepo: Repository<Otp>) {}
}

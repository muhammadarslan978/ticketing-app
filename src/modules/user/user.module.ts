import { Module } from '@nestjs/common'
import { UserController } from './controller/user.controller'
import { UserService } from './service/user.service'
import { DatabaseModule } from '../database/database.module'
import { OtpService } from './otp/otp.service'

@Module({
    imports: [DatabaseModule],
    controllers: [UserController],
    providers: [UserService, OtpService],
})
export class UserModule {}

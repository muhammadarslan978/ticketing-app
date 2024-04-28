import {
    Controller,
    Post,
    Body,
    Get,
    InternalServerErrorException,
    UseInterceptors,
    UseGuards,
    Request,
    UsePipes,
    ValidationPipe,
    Query,
    ParseUUIDPipe,
    Param,
} from '@nestjs/common'

import { UserService } from '../service/user.service'
import { CreateUserDto, LoginDto, ResendOtpDto, VerifyOtpDto } from '../dto/user.dto'
import { ResendOtpResponse, SigninResponse, SignupResponse, VerifyOtpResponse } from '../user.interface'

@Controller('user')
export class UserController {
    constructor(private readonly service: UserService) {}

    @Post('/signup')
    @UsePipes(new ValidationPipe())
    async signup(@Body() body: CreateUserDto): Promise<SignupResponse> {
        return this.service.createUser(body)
    }

    @Post('/otp-verify')
    @UsePipes(new ValidationPipe())
    async verifyOtp(@Body() body: VerifyOtpDto): Promise<VerifyOtpResponse> {
        return this.service.verify(body)
    }

    @Post('/resend-otp')
    @UsePipes(new ValidationPipe())
    async resendOtp(@Body() body: ResendOtpDto): Promise<ResendOtpResponse> {
        return this.service.resend(body)
    }

    @Post('/signin')
    @UsePipes(new ValidationPipe())
    async signin(@Body() body: LoginDto): Promise<SigninResponse> {
        return this.service.signin(body)
    }
}

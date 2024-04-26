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
import { CreateUserDto } from '../dto/user.dto'

@Controller('user')
export class UserController {
    constructor(private readonly service: UserService) {}

    @Post('/signup')
    @UsePipes(new ValidationPipe())
    @UsePipes()
    async signup(@Body() body: CreateUserDto): Promise<any> {
        try {
            return this.service.createUser(body)
        } catch (err) {
            throw new InternalServerErrorException(err)
        }
    }

    @Post('/signin')
    @UsePipes(new ValidationPipe())
    @UsePipes()
    async signin(@Body() body: CreateUserDto): Promise<any> {
        try {
            return this.service.signin(body)
        } catch (err) {
            throw new InternalServerErrorException(err)
        }
    }
}

import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator'
import { USERROLE } from '../../../constant'

export class CreateUserDto {
    @IsString()
    @MinLength(4)
    username: string

    @IsEmail()
    email: string

    @IsString()
    @MinLength(6)
    password: string

    @IsString()
    firstName: string

    @IsString()
    lastName: string
}

export class LoginDto {
    @IsEmail()
    email: string

    @MinLength(6)
    password: string
}

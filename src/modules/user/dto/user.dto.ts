import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator'
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

export class VerifyOtpDto {
    @IsEmail({}, { message: 'Invalid email format' })
    email: string

    @IsNotEmpty({ message: 'Code is required' })
    @IsNumber({}, { message: 'Code must be a numeric value' })
    code: number
}

export class ResendOtpDto {
    @IsEmail({}, { message: 'Invalid email format' })
    email: string
}

export class OtpInputDto {
    @IsString()
    @IsNotEmpty({ message: 'User id is required' })
    userId: string

    @IsNotEmpty({ message: 'Code is required' })
    @IsNumber({}, { message: 'Code must be a numeric value' })
    code: number
}

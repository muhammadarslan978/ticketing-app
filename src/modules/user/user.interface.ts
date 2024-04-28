import { IUser } from '../database/entity/user'

export interface SignupResponse {
    message: string
}

export interface VerifyOtpResponse {
    message: string
}

export interface ResendOtpResponse {
    message: string
}

export interface SigninResponse {
    user: IUser
    token: string
}

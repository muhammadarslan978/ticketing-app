import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { TokenPayload } from 'src/types'

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    generateToken(payload: TokenPayload): string {
        return this.jwtService.sign(payload)
    }
}

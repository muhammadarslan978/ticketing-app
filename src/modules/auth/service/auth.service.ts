import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { TokenPayload } from 'src/types'

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    generateToken(payload: TokenPayload): string {
        return this.jwtService.sign(payload)
    }

    async verifyToken(token: string): Promise<any> {
        try {
            const decoded = this.jwtService.verify(token)
            return decoded
        } catch (err) {
            if (err instanceof HttpException) {
                throw err
            }
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}

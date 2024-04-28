import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { AuthService } from './service/auth.service'
import { JWTAuthGuard } from './guard/auth.gaurd'
import { JwtStrategy } from './strategy/jwt.strategy'
import { Reflector } from '@nestjs/core'

@Module({
    imports: [
        JwtModule.register({
            secret: 'jhjshadjhjasdjh',
            signOptions: { expiresIn: '60m' },
        }),

        PassportModule,
    ],
    providers: [AuthService, JWTAuthGuard, JwtStrategy, Reflector],
    exports: [AuthService],
})
export class AuthModule {}

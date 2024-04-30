import { Injectable, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common'
import { Observable } from 'rxjs'
import { AuthService } from '../service/auth.service'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JWTAuthGuard extends AuthGuard('jwt') {
    constructor(
        private reflector: Reflector,
        private authService: AuthService,
    ) {
        super()
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        try {
            const token = this.extractTokenFromHeader(request.headers.authorization)
            if (!token) {
                throw new HttpException('Token not provided', HttpStatus.UNAUTHORIZED)
            }
            const user = await this.authService.verifyToken(token)
            if (!user.verify) {
                throw new HttpException('User not verified yet', HttpStatus.CONFLICT)
            }
            request.user = user // Attach the user object to the request
            return true
        } catch (err) {
            if (err instanceof HttpException) {
                throw err
            }
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    private extractTokenFromHeader(authorizationHeader: string): string | null {
        if (!authorizationHeader) {
            return null
        }
        const parts = authorizationHeader.split(' ')
        if (parts.length === 2 && parts[0] === 'Bearer') {
            return parts[1]
        }
        return null
    }

    // handleRequest<TUser = any>(
    //     err: any,
    //     user: any,
    //     info: any,
    //     context: ExecutionContext,
    //     _status?: any,
    // ): TUser {
    //     if (err || !user) {
    //         throw err || new UnauthorizedException()
    //     }
    //     const roles = this.reflector.get<USERROLE[]>(
    //         'roles',
    //         context.getHandler(),
    //     )

    //     if (roles.length != 0 && !roles?.includes(user.role)) {
    //         throw new UnauthorizedException()
    //     }

    //     return user
    // }
}

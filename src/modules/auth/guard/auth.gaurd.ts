import { Injectable, ExecutionContext } from '@nestjs/common'
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

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context)
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

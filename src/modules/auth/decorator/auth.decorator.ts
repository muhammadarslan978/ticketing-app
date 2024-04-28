import { UseGuards } from '@nestjs/common'
import { JWTAuthGuard } from '../guard/auth.gaurd'
import { USERROLE } from 'src/constant'

export const Auth = (...roles: USERROLE[]): ((target: any, key?: string | symbol, descriptor?: PropertyDescriptor) => void) => {
    return (target: any, key?: string | symbol, descriptor?: PropertyDescriptor): void => {
        Reflect.defineMetadata('roles', [...roles], descriptor ? descriptor.value : target)

        UseGuards(JWTAuthGuard)(target, key, descriptor)
    }
}

// Sample Usage: @Auth(USERROLE.ADMIN, USERROLE.USER)

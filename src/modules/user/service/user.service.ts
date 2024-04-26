import { Injectable } from '@nestjs/common'

import { CreateUserDto } from '../dto/user.dto'
import { promises } from 'dns'

@Injectable()
export class UserService {
    constructor() {}

    async createUser(obj: CreateUserDto): Promise<any> {}

    async signin(obj: CreateUserDto): Promise<any> {}
}

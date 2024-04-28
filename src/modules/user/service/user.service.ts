import { ConflictException, Inject, Injectable } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'

import { CreateUserDto } from '../dto/user.dto'
import { promises } from 'dns'
import { REPOSITORY } from 'src/constant'
import { Repository } from 'typeorm'
import { User } from 'src/modules/database/entity/user'

@Injectable()
export class UserService {
    constructor(@Inject(REPOSITORY.USER_REPOSITORY) private userRepo: Repository<User>) {}

    async createUser(obj: CreateUserDto): Promise<any> {
        try {
            const existedUser = await this.userRepo.findOne({ where: [{ email: obj.email }, { username: obj.username }] })
            if (existedUser) {
                throw new ConflictException('User Already exist')
            }
            const hash = await bcrypt.hash(obj.password, 10)
            obj.password = hash
            const user = new User()
            Object.assign(user, obj)
            const savedUser = this.userRepo.save(user)
            return savedUser
        } catch (err) {
            throw new Error(err.message)
        }
    }

    async signin(obj: CreateUserDto): Promise<any> {}
}

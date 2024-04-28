// user.entity.ts
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { USERROLE } from '../../../constant'
import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'
import { Otp } from './otp'

@Entity()
export class User extends BaseEntity {
    constructor(defaults?: IUser) {
        super()
        if (defaults) {
            Object.assign(this, defaults)
        }
        if (!this.id) {
            this.id = uuidv4()
        }
    }

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    username: string

    @Column()
    email: string

    @Column()
    password: string

    @Column({ nullable: true })
    firstName?: string

    @Column({ nullable: true })
    lastName?: string

    @Column({ default: false })
    isActive: boolean

    @Column({ default: false })
    isVerified: boolean

    @Column({ enum: USERROLE, default: USERROLE.USER })
    role: USERROLE

    @OneToMany(() => Otp, (otp) => otp.user, { cascade: true, onDelete: 'CASCADE' }) // Enable cascading and set onDelete to CASCADE
    otps: Otp[]
}

export interface IUser {
    id?: string
    username: string
    email: string
    password: string
    firstName?: string
    lastName?: string
    isActive?: boolean
    isVerified: boolean
    role: USERROLE
}

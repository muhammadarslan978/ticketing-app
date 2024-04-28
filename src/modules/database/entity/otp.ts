/* eslint-disable @typescript-eslint/explicit-function-return-type */
// otp.entity.ts
import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'
import { User } from './user'

@Entity()
export class Otp extends BaseEntity {
    constructor(defaults?: IOtp) {
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
    otpCode: number

    @Column({ default: false })
    isUsed: boolean

    @Column()
    expirationTime: Date

    @ManyToOne(() => User, (user) => user.otps, { onDelete: 'CASCADE' }) // Set onDelete option to CASCADE
    user: User
}

export interface IOtp {
    id?: string
    otpCode: number
    expirationTime: Date
    isUsed?: boolean
}

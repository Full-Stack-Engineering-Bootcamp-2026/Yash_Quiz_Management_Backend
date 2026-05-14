import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Attempt } from '../../attempts/entity/attempt.entity'; // Adjust path if needed

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'uuid', unique: true, generated: 'uuid' })
    uid: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @OneToMany(() => Attempt, attempt => attempt.user)
    attempts: Attempt[];

    @CreateDateColumn()
    createdAt: Date;
}
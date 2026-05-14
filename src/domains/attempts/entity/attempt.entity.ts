import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { Quiz } from '../../quizzes/entity/quiz.entity';
import { AttemptAnswer } from '../../attempt-answers/entity/attempt-answer.entity';
import { User } from '../../users/entity/user.entity';

@Entity('attempts')
export class Attempt {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'uuid', unique: true, generated: 'uuid' })
    uid: string;

    @ManyToOne(() => User, user => user.attempts)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: number;

    @ManyToOne(() => Quiz, quiz => quiz.attempts)
    @JoinColumn({ name: 'quizId' })
    quiz: Quiz;

    @Column()
    quizId: number;

    @OneToMany(() => AttemptAnswer, answer => answer.attempt, { cascade: true })
    answers: AttemptAnswer[];

    @CreateDateColumn()
    createdAt: Date;
}
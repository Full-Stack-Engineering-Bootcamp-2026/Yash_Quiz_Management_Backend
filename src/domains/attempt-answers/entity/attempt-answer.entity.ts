import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Attempt } from '../../attempts/entity/attempt.entity';
import { Question } from '../../questions/entity/question.entity';
import { QuestionOption } from '../../question-options/entity/question-option.entity';

@Entity('attempt_answers')
export class AttemptAnswer {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'uuid', unique: true, generated: 'uuid' })
    uid: string;

    @ManyToOne(() => Attempt, attempt => attempt.answers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'attemptId' })
    attempt: Attempt;

    @Column()
    attemptId: number;

    @ManyToOne(() => Question)
    @JoinColumn({ name: 'questionId' })
    question: Question;

    @Column()
    questionId: number;

    @Column({ type: 'text', nullable: true })
    textResponse: string;

    @ManyToMany(() => QuestionOption)
    @JoinTable({
        name: 'attempt_answer_options',
        joinColumn: { name: 'attemptAnswerId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'questionOptionId', referencedColumnName: 'id' }
    })
    selectedOptions: QuestionOption[];
}
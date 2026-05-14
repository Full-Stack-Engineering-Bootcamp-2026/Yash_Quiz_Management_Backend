import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Question } from '../../questions/entity/question.entity';

@Entity('question_options')
export class QuestionOption {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'uuid', unique: true, generated: 'uuid' })
    uid: string;

    @Column()
    text: string;

    @ManyToOne(() => Question, question => question.options, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'questionId' })
    question: Question;

    @Column()
    questionId: number;
}
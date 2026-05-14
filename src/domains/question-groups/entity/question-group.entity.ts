import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Question } from '../../questions/entity/question.entity';


@Entity('question_groups')
export class QuestionGroup {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'uuid', unique: true, generated: 'uuid' })
    uid: string;

    @OneToMany(() => Question, question => question.group)
    questions: Question[];
}
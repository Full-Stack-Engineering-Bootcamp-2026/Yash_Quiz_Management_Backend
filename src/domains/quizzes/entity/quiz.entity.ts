import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { QuestionGroup } from '../../question-groups/entity/question-group.entity';
import { Attempt } from '../../attempts/entity/attempt.entity';

@Entity('quizzes')
export class Quiz {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'uuid', unique: true, generated: 'uuid' })
    uid: string;

    @Column()
    title: string;

    @ManyToMany(() => QuestionGroup)
    @JoinTable({
        name: 'quiz_questions',
        joinColumn: { name: 'quizId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'questionGroupId', referencedColumnName: 'id' }
    })
    questionGroups: QuestionGroup[];

    @OneToMany(() => Attempt, attempt => attempt.quiz)
    attempts: Attempt[];
}
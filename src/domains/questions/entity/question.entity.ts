import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { QuestionOption } from '../../question-options/entity/question-option.entity';
import { QuestionGroup } from '../../question-groups/entity/question-group.entity';

export enum QuestionType {
    RADIO = 'radio',
    CHECKBOX = 'checkbox',
    TEXTAREA = 'textarea',
}

@Entity('questions')
export class Question {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'uuid', unique: true, generated: 'uuid' })
    uid: string;

    @Column()
    text: string;

    @Column({ type: 'enum', enum: QuestionType })
    type: QuestionType;

    @OneToMany(() => QuestionOption, option => option.question, { cascade: true })
    options: QuestionOption[];

    @Column({ type: 'int', default: 1 })
    version: number;

    @Column({ type: 'boolean', default: true })
    isLatest: boolean;

    @ManyToOne(() => QuestionGroup, group => group.questions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'groupId' })
    group: QuestionGroup;

    @Column()
    groupId: number;

    @CreateDateColumn()
    createdAt: Date;
}
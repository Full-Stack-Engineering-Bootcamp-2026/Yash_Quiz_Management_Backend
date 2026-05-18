import { Service } from "typedi";
import { Repository, In } from "typeorm";
import { AppDataSource } from "../../../db/db";
import { Quiz } from "../entity/quiz.entity";
import { QuestionGroup } from "../../question-groups/entity/question-group.entity";

@Service()
export class QuizRepository {
    private quizRepo: Repository<Quiz>;
    private groupRepo: Repository<QuestionGroup>;

    constructor() {
        this.quizRepo = AppDataSource.getRepository(Quiz);
        this.groupRepo = AppDataSource.getRepository(QuestionGroup);
    }

    public async createQuiz(title: string, groups: QuestionGroup[]): Promise<Quiz> {
        const quiz = this.quizRepo.create({
            title,
            questionGroups: groups
        });
        return await this.quizRepo.save(quiz);
    }

    public async findGroupsByUids(groupUids: string[]): Promise<QuestionGroup[]> {
        return await this.groupRepo.find({
            where: { uid: In(groupUids) }
        });
    }

    public async findAllQuizzes(): Promise<Quiz[]> {
        return await this.quizRepo.find();
    }

    public async findQuizByUid(quizUid: string): Promise<Quiz | null> {
        return await this.quizRepo.findOne({
            where: { uid: quizUid },
            relations: ["questionGroups", "questionGroups.questions", "questionGroups.questions.options"]
        });
    }
}
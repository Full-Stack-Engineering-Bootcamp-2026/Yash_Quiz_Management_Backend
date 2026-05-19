import { Service } from "typedi";
import { Repository } from "typeorm";
import { AppDataSource } from "../../../db/db";
import { Attempt } from "../entity/attempt.entity";
import { Quiz } from "../../quizzes/entity/quiz.entity";
import { Question } from "../../questions/entity/question.entity";
import { QuestionOption } from "../../question-options/entity/question-option.entity";
import { GetAttemptsFilterDTO } from "../types/attempt.dto";
import { AttemptAnswer } from "../../attempt-answers/entity/attempt-answer.entity";

@Service()
export class AttemptRepository {
    private attemptRepo: Repository<Attempt>;
    private answerRepo: Repository<AttemptAnswer>;
    private quizRepo: Repository<Quiz>;
    private questionRepo: Repository<Question>;
    private optionRepo: Repository<QuestionOption>;

    constructor() {
        this.attemptRepo = AppDataSource.getRepository(Attempt);
        this.answerRepo = AppDataSource.getRepository(AttemptAnswer);
        this.quizRepo = AppDataSource.getRepository(Quiz);
        this.questionRepo = AppDataSource.getRepository(Question);
        this.optionRepo = AppDataSource.getRepository(QuestionOption);
    }

    public async findQuizByUid(uid: string): Promise<Quiz | null> {
        return await this.quizRepo.findOne({ where: { uid } });
    }

    public async findQuestionByUid(uid: string): Promise<Question | null> {
        return await this.questionRepo.findOne({ where: { uid } });
    }

    public async findOptionsByUids(uids: string[]): Promise<QuestionOption[]> {
        if (!uids || uids.length === 0) return [];
        return await this.optionRepo.createQueryBuilder("option")
            .where("option.uid IN (:...uids)", { uids })
            .getMany();
    }

    public async saveAttempt(attempt: Partial<Attempt>): Promise<Attempt> {
        const newAttempt = this.attemptRepo.create(attempt);
        return await this.attemptRepo.save(newAttempt);
    }

    public async findAttemptsWithFilters(
        filters: GetAttemptsFilterDTO,
        skip: number,
        take: number,
        requestingUserId?: number
    ): Promise<[Attempt[], number]> {

        const qb = this.attemptRepo.createQueryBuilder("attempt")
            .leftJoinAndSelect("attempt.user", "user")
            .leftJoinAndSelect("attempt.quiz", "quiz")
            .leftJoinAndSelect("attempt.answers", "answers")
            .leftJoinAndSelect("answers.question", "question")
            .leftJoinAndSelect("answers.selectedOptions", "options");

        if (requestingUserId) {
            qb.andWhere("user.id = :userId", { userId: requestingUserId });
        } else if (filters.userUid) {
            qb.andWhere("user.uid = :userUid", { userUid: filters.userUid });
        }

        if (filters.quizUid) {
            qb.andWhere("quiz.uid = :quizUid", { quizUid: filters.quizUid });
        }

        qb.skip(skip).take(take).orderBy("attempt.createdAt", "DESC");

        return await qb.getManyAndCount();
    }

    public async findAttemptWithFullDetails(uid: string): Promise<Attempt | null> {
        return await this.attemptRepo.findOne({
            where: { uid },
            relations: [
                "user",
                "quiz",
                "answers",
                "answers.question",
                "answers.question.options",
                "answers.selectedOptions"
            ]
        });
    }
}
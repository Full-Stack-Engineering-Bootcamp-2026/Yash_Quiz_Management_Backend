import { Service } from "typedi";
import { Repository } from "typeorm";
import { AppDataSource } from "../../../db/db";
import { AttemptAnswer } from "../entity/attempt-answer.entity";

@Service()
export class AttemptAnswerRepository {
    private answerRepo: Repository<AttemptAnswer>;

    constructor() {
        this.answerRepo = AppDataSource.getRepository(AttemptAnswer);
    }

    public async findAnswerWithRelations(uid: string): Promise<AttemptAnswer | null> {
        return await this.answerRepo.findOne({
            where: { uid },
            relations: ["attempt", "attempt.user", "question", "selectedOptions"]
        });
    }
}
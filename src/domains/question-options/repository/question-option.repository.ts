import { Service } from "typedi";
import { Repository } from "typeorm";
import { AppDataSource } from "../../../db/db";
import { QuestionOption } from "../entity/question-option.entity";

@Service()
export class QuestionOptionRepository {
    private optionRepo: Repository<QuestionOption>;

    constructor() {
        this.optionRepo = AppDataSource.getRepository(QuestionOption);
    }

    public async findOptionWithRelations(uid: string): Promise<QuestionOption | null> {
        return await this.optionRepo.findOne({
            where: { uid },
            relations: ["question", "question.group"]
        });
    }
}
import { Service } from "typedi";
import { Repository } from "typeorm";
import { AppDataSource } from "../../../db/db";
import { QuestionGroup } from "../entity/question-group.entity";

@Service()
export class QuestionGroupRepository {
    private groupRepo: Repository<QuestionGroup>;

    constructor() {
        this.groupRepo = AppDataSource.getRepository(QuestionGroup);
    }

    public async findGroupWithHistory(uid: string): Promise<QuestionGroup | null> {
        return await this.groupRepo.findOne({
            where: { uid },
            relations: ["questions", "questions.options"],
            order: {
                questions: { version: "DESC" }
            }
        });
    }
}
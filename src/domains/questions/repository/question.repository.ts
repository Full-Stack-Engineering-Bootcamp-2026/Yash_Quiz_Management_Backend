import { Service } from "typedi";
import { Repository } from "typeorm";
import { AppDataSource } from "../../../db/db";
import { Question } from "../entity/question.entity";
import { QuestionGroup } from "../../question-groups/entity/question-group.entity";
import { QuestionOption } from "../../question-options/entity/question-option.entity";
import { GetQuestionsFilterDTO } from "../types/question.dto";

@Service()
export class QuestionRepository {
    private questionRepo: Repository<Question>;
    private groupRepo: Repository<QuestionGroup>;
    private optionRepo: Repository<QuestionOption>;

    constructor() {
        this.questionRepo = AppDataSource.getRepository(Question);
        this.groupRepo = AppDataSource.getRepository(QuestionGroup);
        this.optionRepo = AppDataSource.getRepository(QuestionOption);
    }

    public async findQuestionsWithFilters(
        filters: GetQuestionsFilterDTO,
        skip: number,
        take: number
    ): Promise<[Question[], number]> {

        const qb = this.questionRepo.createQueryBuilder("question")
            .leftJoinAndSelect("question.group", "group")
            .leftJoinAndSelect("question.options", "options");

        if (filters.isLatest !== undefined) {
            qb.andWhere("question.isLatest = :isLatest", { isLatest: filters.isLatest });
        }
        if (filters.type) {
            qb.andWhere("question.type = :type", { type: filters.type });
        }
        if (filters.groupUid) {
            qb.andWhere("group.uid = :groupUid", { groupUid: filters.groupUid });
        }
        if (filters.search) {
            qb.andWhere("question.text LIKE :search", { search: `%${filters.search}%` });
        }

        qb.skip(skip).take(take).orderBy("question.createdAt", "DESC");

        return await qb.getManyAndCount();
    }

    public async findLatestByGroupUid(groupUid: string): Promise<Question | null> {
        return await this.questionRepo.createQueryBuilder("question")
            .leftJoinAndSelect("question.group", "group")
            .leftJoinAndSelect("question.options", "options")
            .where("group.uid = :groupUid", { groupUid })
            .andWhere("question.isLatest = :isLatest", { isLatest: true })
            .getOne();
    }
    
    public async createGroup(): Promise<QuestionGroup> {
        const group = this.groupRepo.create();
        return await this.groupRepo.save(group);
    }

    public async saveQuestion(question: Partial<Question>): Promise<Question> {
        const newQuestion = this.questionRepo.create(question);
        return await this.questionRepo.save(newQuestion);
    }

    public async saveOptions(options: Partial<QuestionOption>[]): Promise<QuestionOption[]> {
        const newOptions = this.optionRepo.create(options);
        return await this.optionRepo.save(newOptions);
    }

    public async markAsOutdated(questionId: number): Promise<void> {
        await this.questionRepo.update(questionId, { isLatest: false });
    }
}
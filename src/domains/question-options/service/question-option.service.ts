import { Service } from "typedi";
import { QuestionOptionRepository } from "../repository/question-option.repository";
import { NotFoundException } from "../../../common/exceptions";

@Service()
export class QuestionOptionService {
    constructor(private readonly optionRepository: QuestionOptionRepository) { }

    public async getOptionByUid(uid: string) {
        const option = await this.optionRepository.findOptionWithRelations(uid);

        if (!option) {
            throw new NotFoundException("Question Option not found");
        }

        return {
            uid: option.uid,
            text: option.text,
            questionUid: option.question.uid,
            groupUid: option.question.group.uid
        };
    }
}
import { Service } from "typedi";
import { QuestionGroupRepository } from "../repository/question-group.repository";
import { QuestionGroupResponseDTO } from "../types/question-group.dto";
import { NotFoundException } from "../../../common/exceptions";

@Service()
export class QuestionGroupService {
    constructor(private readonly groupRepository: QuestionGroupRepository) { }

    public async getGroupHistory(uid: string): Promise<QuestionGroupResponseDTO> {
        const group = await this.groupRepository.findGroupWithHistory(uid);

        if (!group) {
            throw new NotFoundException("Question Group not found");
        }

        return {
            uid: group.uid,
            createdAt: group.createdAt,
            versions: group.questions.map(q => ({
                uid: q.uid,
                groupUid: group.uid,
                text: q.text,
                type: q.type,
                version: q.version,
                isLatest: q.isLatest,
                createdAt: q.createdAt,
                options: q.options?.map(opt => ({ uid: opt.uid, text: opt.text }))
            }))
        };
    }
}
import { Service } from "typedi";
import { QuestionRepository } from "../repository/question.repository";
import { CreateQuestionDTO, UpdateQuestionDTO, GetQuestionsFilterDTO, PaginatedResponse, QuestionResponseDTO } from "../types/question.dto";
import { Question } from "../entity/question.entity";
import { NotFoundException } from "../../../common/exceptions";

@Service()
export class QuestionService {
    constructor(private readonly questionRepository: QuestionRepository) { }

    private mapToResponse(question: Question): QuestionResponseDTO {
        return {
            uid: question.uid,
            groupUid: question.group.uid,
            text: question.text,
            type: question.type,
            version: question.version,
            isLatest: question.isLatest,
            createdAt: question.createdAt,
            options: question.options?.map(opt => ({
                uid: opt.uid,
                text: opt.text
            }))
        };
    }

    public async getQuestions(filters: GetQuestionsFilterDTO): Promise<PaginatedResponse<QuestionResponseDTO>> {
        const page = Number(filters.page) || 1;
        const limit = Number(filters.limit) || 10;
        const skip = (page - 1) * limit;

        const [questions, total] = await this.questionRepository.findQuestionsWithFilters(filters, skip, limit);

        return {
            data: questions.map(q => this.mapToResponse(q)),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    public async createQuestion(data: CreateQuestionDTO): Promise<QuestionResponseDTO> {
        const group = await this.questionRepository.createGroup();

        const question = await this.questionRepository.saveQuestion({
            text: data.text,
            type: data.type,
            groupId: group.id,
            version: 1,
            isLatest: true,
        });

        if (data.options && data.options.length > 0) {
            const optionsData = data.options.map(opt => ({ text: opt, questionId: question.id }));
            question.options = await this.questionRepository.saveOptions(optionsData);
        }

        question.group = group;
        return this.mapToResponse(question);
    }

    public async updateQuestion(groupUid: string, data: UpdateQuestionDTO): Promise<QuestionResponseDTO> {
        const currentLatest = await this.questionRepository.findLatestByGroupUid(groupUid);

        if (!currentLatest) {
            throw new NotFoundException("Question group not found or has no active questions");
        }

        await this.questionRepository.markAsOutdated(currentLatest.id);

        const newQuestion = await this.questionRepository.saveQuestion({
            text: data.text,
            type: data.type,
            groupId: currentLatest.groupId,
            version: currentLatest.version + 1,
            isLatest: true,
        });

        if (data.options && data.options.length > 0) {
            const optionsData = data.options.map(opt => ({ text: opt, questionId: newQuestion.id }));
            newQuestion.options = await this.questionRepository.saveOptions(optionsData);
        }

        newQuestion.group = currentLatest.group;
        return this.mapToResponse(newQuestion);
    }
}
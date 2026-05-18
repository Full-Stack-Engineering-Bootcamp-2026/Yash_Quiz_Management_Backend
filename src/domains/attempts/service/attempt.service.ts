import { Service } from "typedi";
import { AttemptRepository } from "../repository/attempt.repository";
import { CreateAttemptDTO, GetAttemptsFilterDTO, PaginatedResponse, AttemptResponseDTO } from "../types/attempt.dto";
import { Attempt } from "../entity/attempt.entity";
import { NotFoundException, BadRequestException } from "../../../common/exceptions";
import { AttemptAnswer } from "../../attempt-answers/entity/attempt-answer.entity";
import { UserRepository } from "../../users/repository/user.repository";

@Service()
export class AttemptService {
  constructor(
    private readonly attemptRepository: AttemptRepository,
    private readonly userRepository: UserRepository
  ) { }

  private mapToResponse(attempt: Attempt): AttemptResponseDTO {
    return {
      uid: attempt.uid,
      quizUid: attempt.quiz.uid,
      userUid: attempt.user.uid,
      createdAt: attempt.createdAt,
      answers: attempt.answers.map(ans => ({
        uid: ans.uid,
        questionUid: ans.question.uid,
        textResponse: ans.textResponse,
        selectedOptionUids: ans.selectedOptions?.map(opt => opt.uid) || []
      }))
    };
  }

  public async submitAttempt(userId: number, data: CreateAttemptDTO): Promise<AttemptResponseDTO> {
    const quiz = await this.attemptRepository.findQuizByUid(data.quizUid);
    if (!quiz) throw new NotFoundException("Quiz not found");

    const attemptAnswers: Partial<AttemptAnswer>[] = [];

    for (const answerData of data.answers) {
      const question = await this.attemptRepository.findQuestionByUid(answerData.questionUid);
      if (!question) throw new BadRequestException(`Invalid question UID: ${answerData.questionUid}`);

      const answerRecord: Partial<AttemptAnswer> = {
        question: question,
        textResponse: answerData.textResponse,
      };

      if (answerData.optionUids && answerData.optionUids.length > 0) {
        const options = await this.attemptRepository.findOptionsByUids(answerData.optionUids);
        if (options.length !== answerData.optionUids.length) {
          throw new BadRequestException("One or more option UIDs are invalid");
        }
        answerRecord.selectedOptions = options;
      }

      attemptAnswers.push(answerRecord);
    }

    const savedAttempt = await this.attemptRepository.saveAttempt({
      user: { id: userId } as any,
      quiz: quiz,
      answers: attemptAnswers as AttemptAnswer[]
    });

    const user = await this.userRepository.findById(userId);

    savedAttempt.quiz = quiz;
    savedAttempt.user = { uid: user!.uid } as any;

    return this.mapToResponse(savedAttempt);
  }

  public async getAttempts(
    filters: GetAttemptsFilterDTO,
    requestingUserId?: number
  ): Promise<PaginatedResponse<AttemptResponseDTO>> {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 10;
    const skip = (page - 1) * limit;

    const [attempts, total] = await this.attemptRepository.findAttemptsWithFilters(filters, skip, limit, requestingUserId);

    return {
      data: attempts.map(att => this.mapToResponse(att)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}
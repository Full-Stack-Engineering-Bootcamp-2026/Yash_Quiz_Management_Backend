import { Service } from "typedi";
import { AttemptAnswerRepository } from "../repository/attempt-answer.repository";
import { NotFoundException, UnauthorizedException } from "../../../common/exceptions";
import { UserRole } from "../../users/entity/user.entity";

@Service()
export class AttemptAnswerService {
    constructor(private readonly answerRepository: AttemptAnswerRepository) { }

    public async getAnswerByUid(uid: string, requestingUserId: number, requestingUserRole: UserRole) {
        const answer = await this.answerRepository.findAnswerWithRelations(uid);

        if (!answer) {
            throw new NotFoundException("Attempt Answer not found");
        }

        if (requestingUserRole === UserRole.USER && answer.attempt.user.id !== requestingUserId) {
            throw new UnauthorizedException("You do not have permission to view this answer");
        }

        return {
            uid: answer.uid,
            attemptUid: answer.attempt.uid,
            questionUid: answer.question.uid,
            textResponse: answer.textResponse,
            selectedOptionUids: answer.selectedOptions?.map(opt => opt.uid) || []
        };
    }
}
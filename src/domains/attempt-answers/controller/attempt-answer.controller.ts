import { Response } from "express";
import { Service } from "typedi";
import { HttpStatus } from "../../../common/constants/http-status.constants";
import { AuthRequest } from "../../../common/interfaces/auth-request.interface";
import { success } from "../../../Http_Response/response";
import { AttemptAnswerService } from "../service/attempt-answer.service";

@Service()
export class AttemptAnswerController {
    constructor(private readonly answerService: AttemptAnswerService) { }

    public async getOne(req: AuthRequest, res: Response): Promise<void> {
        const uid = req.params.uid as string;

        const answer = await this.answerService.getAnswerByUid(uid, req.user!.userId, req.user!.role);

        res.status(HttpStatus.OK).json(success(answer, "Attempt answer retrieved"));
    }
}
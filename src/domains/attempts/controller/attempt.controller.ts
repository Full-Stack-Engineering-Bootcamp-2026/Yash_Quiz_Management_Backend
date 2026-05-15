import { Response } from "express";
import { Service } from "typedi";
import { AttemptService } from "../service/attempt.service";
import { CreateAttemptDTO, GetAttemptsFilterDTO } from "../types/attempt.dto";
import { HttpStatus } from "../../../common/constants/http-status.constants";
import { SuccessMessages } from "../../../common/constants/success-messages.constants";
import { AuthRequest } from "../../../common/interfaces/auth-request.interface";
import { UserRole } from "../../users/entity/user.entity";
import { success } from "../../../Http_Response/response";

@Service()
export class AttemptController {
    constructor(private readonly attemptService: AttemptService) { }

    public async submit(req: AuthRequest, res: Response): Promise<void> {
        const userId = req.user!.userId;
        const payload: CreateAttemptDTO = req.body;

        const result = await this.attemptService.submitAttempt(userId, payload);

        res.status(HttpStatus.CREATED).json(
            success(result, SuccessMessages.CREATED)
        );
    }

    public async getHistory(req: AuthRequest, res: Response): Promise<void> {
        const filters = req.query as unknown as GetAttemptsFilterDTO;
        const userRole = req.user!.role;
        const userId = req.user!.userId;

        const restrictToUserId = userRole === UserRole.ADMIN ? undefined : userId;

        const paginatedResult = await this.attemptService.getAttempts(filters, restrictToUserId);

        res.status(HttpStatus.OK).json(
            success(paginatedResult, "Attempt history retrieved successfully")
        );
    }
}
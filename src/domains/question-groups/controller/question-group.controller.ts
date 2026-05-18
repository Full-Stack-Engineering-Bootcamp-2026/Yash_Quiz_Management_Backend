import { Response } from "express";
import { Service } from "typedi";
import { QuestionGroupService } from "../service/question-group.service";
import { HttpStatus } from "../../../common/constants/http-status.constants";
import { AuthRequest } from "../../../common/interfaces/auth-request.interface";
import { success } from "../../../Http_Response/response";

@Service()
export class QuestionGroupController {
  constructor(private readonly groupService: QuestionGroupService) {}

  public async getOne(req: AuthRequest, res: Response): Promise<void> {
    const uid = req.params.uid as string;
    const history = await this.groupService.getGroupHistory(uid);
    res.status(HttpStatus.OK).json(success(history, "Question group history retrieved"));
  }
}
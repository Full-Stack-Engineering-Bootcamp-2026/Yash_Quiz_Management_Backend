import { Response } from "express";
import { Service } from "typedi";
import { HttpStatus } from "../../../common/constants/http-status.constants";
import { AuthRequest } from "../../../common/interfaces/auth-request.interface";
import { success } from "../../../Http_Response/response";
import { QuestionOptionService } from "../service/question-option.service";

@Service()
export class QuestionOptionController {
  constructor(private readonly optionService: QuestionOptionService) {}

  public async getOne(req: AuthRequest, res: Response): Promise<void> {
    const uid = req.params.uid as string;
    const option = await this.optionService.getOptionByUid(uid);
    res.status(HttpStatus.OK).json(success(option, "Option retrieved"));
  }
}
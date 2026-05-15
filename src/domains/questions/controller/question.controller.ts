import { Response } from "express";
import { Service } from "typedi";
import { QuestionService } from "../service/question.service";
import { CreateQuestionDTO, UpdateQuestionDTO, GetQuestionsFilterDTO } from "../types/question.dto";
import { HttpStatus } from "../../../common/constants/http-status.constants";
import { SuccessMessages } from "../../../common/constants/success-messages.constants";
import { AuthRequest } from "../../../common/interfaces/auth-request.interface";
import { success } from "../../../Http_Response/response";

@Service()
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  public async getAll(req: AuthRequest, res: Response): Promise<void> {
    const filters = req.query as unknown as GetQuestionsFilterDTO;
    const paginatedResult = await this.questionService.getQuestions(filters);
    
    res.status(HttpStatus.OK).json(
      success(paginatedResult, "Questions retrieved successfully")
    );
  }

  public async create(req: AuthRequest, res: Response): Promise<void> {
    const payload: CreateQuestionDTO = req.body;
    const question = await this.questionService.createQuestion(payload);
    
    res.status(HttpStatus.CREATED).json(
      success(question, SuccessMessages.CREATED)
    );
  }

  public async update(req: AuthRequest, res: Response): Promise<void> {
    
    const groupUid = req.params.groupUid as string;
    const payload: UpdateQuestionDTO = req.body;
    
    const newVersion = await this.questionService.updateQuestion(groupUid, payload);
    
    res.status(HttpStatus.OK).json(
      success(newVersion, `Question updated successfully to version ${newVersion.version}`)
    );
  }
}
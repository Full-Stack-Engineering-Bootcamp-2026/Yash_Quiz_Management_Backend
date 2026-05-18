import { Response } from "express";
import { Service } from "typedi";
import { QuizService } from "../service/quiz.service";
import { CreateQuizDTO } from "../types/quiz.dto";
import { HttpStatus } from "../../../common/constants/http-status.constants";
import { SuccessMessages } from "../../../common/constants/success-messages.constants";
import { AuthRequest } from "../../../common/interfaces/auth-request.interface";
import { success } from "../../../Http_Response/response";

@Service()
export class QuizController {
    constructor(private readonly quizService: QuizService) { }

    public async create(req: AuthRequest, res: Response): Promise<void> {
        const payload: CreateQuizDTO = req.body;
        const quiz = await this.quizService.createQuiz(payload);

        res.status(HttpStatus.CREATED).json(
            success(quiz, SuccessMessages.CREATED)
        );
    }

    public async getAll(req: AuthRequest, res: Response): Promise<void> {
        const quizzes = await this.quizService.getAllQuizzes();
        res.status(HttpStatus.OK).json(success(quizzes, "Quizzes retrieved successfully"));
    }

    public async getOne(req: AuthRequest, res: Response): Promise<void> {
        const quizUid = req.params.quizUid as string;
        const quiz = await this.quizService.getQuizForAttempt(quizUid);

        res.status(HttpStatus.OK).json(success(quiz, "Quiz retrieved successfully"));
    }
}
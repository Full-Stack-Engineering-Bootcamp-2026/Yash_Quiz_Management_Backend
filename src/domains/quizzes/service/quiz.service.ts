import { Service } from "typedi";
import { QuizRepository } from "../repository/quiz.repository";
import { CreateQuizDTO, QuizResponseDTO } from "../types/quiz.dto";
import { Quiz } from "../entity/quiz.entity";
import { NotFoundException, BadRequestException } from "../../../common/exceptions";

@Service()
export class QuizService {
    constructor(private readonly quizRepository: QuizRepository) { }

    public async createQuiz(data: CreateQuizDTO): Promise<QuizResponseDTO> {
        const groups = await this.quizRepository.findGroupsByUids(data.questionGroupUids);

        if (groups.length !== data.questionGroupUids.length) {
            throw new BadRequestException("One or more Question Group UIDs are invalid");
        }

        const savedQuiz = await this.quizRepository.createQuiz(data.title, groups);

        return {
            uid: savedQuiz.uid,
            title: savedQuiz.title
        };
    }

    public async getAllQuizzes(): Promise<QuizResponseDTO[]> {
        const quizzes = await this.quizRepository.findAllQuizzes();
        return quizzes.map(quiz => ({
            uid: quiz.uid,
            title: quiz.title
        }));
    }

    public async getQuizForAttempt(quizUid: string): Promise<QuizResponseDTO> {
        const quiz = await this.quizRepository.findQuizByUid(quizUid);

        if (!quiz) {
            throw new NotFoundException("Quiz not found");
        }

        const activeQuestions = quiz.questionGroups.map(group => {
            const activeVersion = group.questions.find(q => q.isLatest === true);

            if (!activeVersion) return null;

            return {
                uid: activeVersion.uid,
                groupUid: group.uid,
                text: activeVersion.text,
                type: activeVersion.type,
                options: activeVersion.options?.map(opt => ({
                    uid: opt.uid,
                    text: opt.text
                }))
            };
        }).filter(q => q !== null);

        return {
            uid: quiz.uid,
            title: quiz.title,
            questions: activeQuestions as any[]
        };
    }
}
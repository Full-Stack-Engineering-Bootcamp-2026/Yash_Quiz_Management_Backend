import { QuestionType } from "../entity/question.entity";

export interface CreateQuestionDTO {
    text: string;
    type: QuestionType;
    options?: string[];
}

export interface UpdateQuestionDTO {
    text: string;
    type: QuestionType;
    options?: string[];
}

export interface GetQuestionsFilterDTO {
    page?: number;
    limit?: number;
    search?: string;
    type?: QuestionType;
    isLatest?: boolean;
    groupUid?: string;
}

export interface QuestionOptionResponseDTO {
    uid: string;
    text: string;
}

export interface QuestionResponseDTO {
    uid: string;
    groupUid: string;
    text: string;
    type: QuestionType;
    version: number;
    isLatest: boolean;
    createdAt: Date;
    options?: QuestionOptionResponseDTO[];
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
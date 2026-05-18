export interface CreateQuizDTO {
    title: string;
    questionGroupUids: string[];
}

export interface QuizOptionResponseDTO {
    uid: string;
    text: string;
}

export interface QuizQuestionResponseDTO {
    uid: string;
    groupUid: string;
    text: string;
    type: string;
    options?: QuizOptionResponseDTO[];
}

export interface QuizResponseDTO {
    uid: string;
    title: string;
    questions?: QuizQuestionResponseDTO[];
}
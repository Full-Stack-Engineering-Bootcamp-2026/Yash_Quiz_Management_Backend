export interface SubmitAnswerDTO {
  questionUid: string;
  textResponse?: string;
  optionUids?: string[];
}

export interface CreateAttemptDTO {
  quizUid: string;
  answers: SubmitAnswerDTO[];
}

export interface GetAttemptsFilterDTO {
  page?: number;
  limit?: number;
  quizUid?: string;
  userUid?: string;
}


export interface AttemptAnswerResponseDTO {
  uid: string;
  questionUid: string;
  textResponse?: string;
  selectedOptionUids?: string[];
}

export interface AttemptResponseDTO {
  uid: string;
  quizUid: string;
  userUid: string;
  createdAt: Date;
  answers: AttemptAnswerResponseDTO[];
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
export interface AttemptDetailResponseDTO {
  uid: string;
  quizUid: string;
  createdAt: Date;
  answers: {
    uid: string;
    textResponse?: string;
    selectedOptionUids?: string[];
    question: {
      uid: string;
      text: string;
      type: "radio" | "checkbox" | "textarea";
      version: number;
      options?: {
        uid: string;
        text: string;
      }[];
    };
  }[];
}
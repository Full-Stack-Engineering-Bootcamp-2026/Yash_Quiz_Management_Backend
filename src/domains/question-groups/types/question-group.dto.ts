import { QuestionResponseDTO } from "../../questions/types/question.dto";

export interface QuestionGroupResponseDTO {
    uid: string;
    createdAt: Date;
    versions: QuestionResponseDTO[];
}
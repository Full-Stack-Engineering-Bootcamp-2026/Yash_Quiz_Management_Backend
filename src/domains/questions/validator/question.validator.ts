import Joi from "joi";
import { QuestionType } from "../entity/question.entity";

export const createQuestionSchema = Joi.object({
    text: Joi.string().required().min(5).max(1000),
    type: Joi.string().valid(QuestionType.RADIO, QuestionType.CHECKBOX, QuestionType.TEXTAREA).required(),
    options: Joi.array().items(Joi.string().trim().min(1)).when('type', {
        is: Joi.valid(QuestionType.RADIO, QuestionType.CHECKBOX),
        then: Joi.array().min(2).required(),
        otherwise: Joi.forbidden()
    })
});

export const updateQuestionSchema = createQuestionSchema;

export const getQuestionsFilterSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().trim().optional(),
    type: Joi.string().valid(QuestionType.RADIO, QuestionType.CHECKBOX, QuestionType.TEXTAREA).optional(),
    isLatest: Joi.boolean().default(true),
    groupId: Joi.number().integer().positive().optional()
});
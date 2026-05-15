import Joi from "joi";

export const submitAnswerSchema = Joi.object({
    questionUid: Joi.string().uuid().required(),
    textResponse: Joi.string().allow('', null).optional(),
    optionUids: Joi.array().items(Joi.string().uuid()).optional()
}).or('textResponse', 'optionUids');

export const createAttemptSchema = Joi.object({
    quizUid: Joi.string().uuid().required(),
    answers: Joi.array().items(submitAnswerSchema).min(1).required()
});

export const getAttemptsFilterSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    quizUid: Joi.string().uuid().optional(),
    userUid: Joi.string().uuid().optional()
});
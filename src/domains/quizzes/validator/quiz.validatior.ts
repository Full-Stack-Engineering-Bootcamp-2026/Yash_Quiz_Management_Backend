import Joi from "joi";

export const createQuizSchema = Joi.object({
    title: Joi.string().required().min(3).max(255),
    questionGroupUids: Joi.array().items(Joi.string().uuid()).min(1).required()
});
import { Router } from "express";
import { Service } from "typedi";
import { QuestionController } from "../controller/question.controller";
import { createQuestionSchema, updateQuestionSchema, getQuestionsFilterSchema } from "../validator/question.validator";
import { asyncHandler } from "../../../common/utils/async-handler";
import { UserRole } from "../../users/entity/user.entity";
import { authenticate } from "../../../common/middleware/authenticate.middleware";
import { requireRole } from "../../../common/middleware/authorize.middleware";
import { validate, validateQuery } from "../../../common/middleware/validate.middleware";

@Service()
export class QuestionRoutes {
    public router: Router;

    constructor(
        private readonly controller: QuestionController
    ) {
        this.router = Router();
        this.addRoutes();
    }

    public getRoutes(): Router {
        return this.router;
    }

    private addRoutes(): void {

        this.router.get(
            "/",
            authenticate,
            requireRole(UserRole.ADMIN),
            validateQuery(getQuestionsFilterSchema), // Validates req.query
            asyncHandler(this.controller.getAll.bind(this.controller))
        );

        this.router.post(
            "/",
            authenticate,
            requireRole(UserRole.ADMIN),
            validate(createQuestionSchema),
            asyncHandler(this.controller.create.bind(this.controller))
        );

        this.router.put(
            "/:groupUid",
            authenticate,
            requireRole(UserRole.ADMIN),
            validate(updateQuestionSchema),
            asyncHandler(this.controller.update.bind(this.controller))
        );
    }
}
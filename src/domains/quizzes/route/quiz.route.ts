import { Router } from "express";
import { Service } from "typedi";
import { QuizController } from "../controller/quiz.controller";
import { asyncHandler } from "../../../common/utils/async-handler";
import { UserRole } from "../../users/entity/user.entity";
import { authenticate } from "../../../common/middleware/authenticate.middleware";
import { requireRole } from "../../../common/middleware/authorize.middleware";
import { validate } from "../../../common/middleware/validate.middleware";
import { createQuizSchema } from "../validator/quiz.validatior";

@Service()
export class QuizRoutes {
    public router: Router;

    constructor(
        private readonly controller: QuizController
    ) {
        this.router = Router();
        this.addRoutes();
    }

    public getRoutes(): Router {
        return this.router;
    }

    private addRoutes(): void {
        this.router.post(
            "/",
            authenticate,
            requireRole(UserRole.ADMIN),
            validate(createQuizSchema),
            asyncHandler(this.controller.create.bind(this.controller))
        );

        this.router.get(
            "/",
            authenticate,
            requireRole(UserRole.ADMIN, UserRole.USER),
            asyncHandler(this.controller.getAll.bind(this.controller))
        );

        this.router.get(
            "/:quizUid",
            authenticate,
            requireRole(UserRole.ADMIN, UserRole.USER),
            asyncHandler(this.controller.getOne.bind(this.controller))
        );
    }
}
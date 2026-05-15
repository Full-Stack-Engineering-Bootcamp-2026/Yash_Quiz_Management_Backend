import { Router } from "express";
import { Service } from "typedi";
import { AttemptController } from "../controller/attempt.controller";

import { createAttemptSchema, getAttemptsFilterSchema } from "../validator/attempt.validator";
import { asyncHandler } from "../../../common/utils/async-handler";
import { UserRole } from "../../users/entity/user.entity";
import { authenticate } from "../../../common/middleware/authenticate.middleware";
import { requireRole } from "../../../common/middleware/authorize.middleware";
import { validate, validateQuery } from "../../../common/middleware/validate.middleware";

@Service()
export class AttemptRoutes {
    public router: Router;

    constructor(
        private readonly controller: AttemptController
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
            requireRole(UserRole.USER),
            validate(createAttemptSchema),
            asyncHandler(this.controller.submit.bind(this.controller))
        );

        this.router.get(
            "/",
            authenticate,
            requireRole(UserRole.ADMIN, UserRole.USER),
            validateQuery(getAttemptsFilterSchema),
            asyncHandler(this.controller.getHistory.bind(this.controller))
        );
    }
}
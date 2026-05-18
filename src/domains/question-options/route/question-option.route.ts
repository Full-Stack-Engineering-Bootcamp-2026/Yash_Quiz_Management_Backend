import { Router } from "express";
import { Service } from "typedi";
import { asyncHandler } from "../../../common/utils/async-handler";
import { UserRole } from "../../users/entity/user.entity";
import { requireRole } from "../../../common/middleware/authorize.middleware";
import { authenticate } from "../../../common/middleware/authenticate.middleware";
import { QuestionOptionController } from "../controller/question-option.controller";

@Service()
export class QuestionGroupRoutes {
    public router: Router;
    constructor(private readonly controller: QuestionOptionController) {
        this.router = Router();
        this.addRoutes();
    }
    public getRoutes(): Router { return this.router; }
    private addRoutes(): void {
        this.router.get(
            "/:uid",
            authenticate,
            requireRole(UserRole.ADMIN),
            asyncHandler(this.controller.getOne.bind(this.controller))
        );
    }
}
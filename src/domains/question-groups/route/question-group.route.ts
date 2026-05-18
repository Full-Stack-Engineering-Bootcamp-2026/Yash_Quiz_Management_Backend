import { Router } from "express";
import { Service } from "typedi";
import { QuestionGroupController } from "../controller/question-group.controller";
import { asyncHandler } from "../../../common/utils/async-handler";
import { UserRole } from "../../users/entity/user.entity";
import { requireRole } from "../../../common/middleware/authorize.middleware";
import { authenticate } from "../../../common/middleware/authenticate.middleware";

@Service()
export class QuestionGroupRoutes {
    public router: Router;
    constructor(private readonly controller: QuestionGroupController) {
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
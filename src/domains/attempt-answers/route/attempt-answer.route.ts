import { Router } from "express";
import { Service } from "typedi";
import { AttemptAnswerController } from "../controller/attempt-answer.controller";
import { asyncHandler } from "../../../common/utils/async-handler";
import { UserRole } from "../../users/entity/user.entity";
import { authenticate } from "../../../common/middleware/authenticate.middleware";
import { requireRole } from "../../../common/middleware/authorize.middleware";

@Service()
export class AttemptAnswerRoutes {
    public router: Router;
    constructor(private readonly controller: AttemptAnswerController) {
        this.router = Router();
        this.addRoutes();
    }
    public getRoutes(): Router { return this.router; }
    private addRoutes(): void {
        this.router.get(
            "/:uid",
            authenticate,
            requireRole(UserRole.ADMIN, UserRole.USER),
            asyncHandler(this.controller.getOne.bind(this.controller))
        );
    }
}
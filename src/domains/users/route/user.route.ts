import { Router } from "express";
import { Service } from "typedi";
import { UserController } from "../controller/user.controller";
import { registerSchema, loginSchema } from "../validator/user.validator";
import { asyncHandler } from "../../../common/utils/async-handler";
import { validate } from "../../../common/middleware/validate.middleware";

@Service()
export class UserRoutes {
    public router: Router;

    constructor(
        private readonly controller: UserController
    ) {
        this.router = Router();
        this.addRoutes();
    }

    public getRoutes(): Router {
        return this.router;
    }

    private addRoutes(): void {
        this.router.post(
            "/register",
            validate(registerSchema),
            asyncHandler(this.controller.register.bind(this.controller))
        );

        this.router.post(
            "/login",
            validate(loginSchema),
            asyncHandler(this.controller.login.bind(this.controller))
        );
    }
}
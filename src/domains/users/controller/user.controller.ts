import { Request, Response } from "express";
import { Service } from "typedi";
import { UserService } from "../service/user.service";
import { RegisterUserDTO, LoginUserDTO } from "../types/user.dto";
import { HttpStatus } from "../../../common/constants/http-status.constants";
import { SuccessMessages } from "../../../common/constants/success-messages.constants";
import { success } from "../../../Http_Response/response";

@Service()
export class UserController {
    constructor(private readonly userService: UserService) { }

    public async register(req: Request, res: Response): Promise<void> {
        const payload: RegisterUserDTO = req.body;
        const result = await this.userService.register(payload);

        res.status(HttpStatus.CREATED).json(
            success(result, SuccessMessages.CREATED)
        );
    }

    public async login(req: Request, res: Response): Promise<void> {
        const payload: LoginUserDTO = req.body;
        const result = await this.userService.login(payload);

        res.status(HttpStatus.OK).json(
            success(result, SuccessMessages.LOGIN)
        );
    }
}
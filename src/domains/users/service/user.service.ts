import { Service } from "typedi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repository/user.repository";
import { RegisterUserDTO, LoginUserDTO, AuthResponseDTO } from "../types/user.dto";
import { AuthErrorMessages } from "../../../common/constants/auth-error-messages.constants";
import { ConflictException, UnauthorizedException } from "../../../common/exceptions";

@Service()
export class UserService {
    constructor(private readonly userRepository: UserRepository) { }

    public async register(data: RegisterUserDTO): Promise<AuthResponseDTO> {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            // The global error handler will catch this and send a 409 status
            throw new ConflictException("User with this email already exists");
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await this.userRepository.saveUser({
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: data.role,
        });

        return this.generateAuthResponse(user);
    }

    public async login(data: LoginUserDTO): Promise<AuthResponseDTO> {
        const user = await this.userRepository.findByEmail(data.email);
        if (!user) {
            throw new UnauthorizedException(AuthErrorMessages.INVALID_CREDENTIALS);
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException(AuthErrorMessages.INVALID_CREDENTIALS);
        }

        return this.generateAuthResponse(user);
    }

    private generateAuthResponse(user: any): AuthResponseDTO {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET environment variable is not set");
        }

        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role,
        };

        const token = jwt.sign(payload, secret, { expiresIn: "24h" });

        return {
            user: {
                uid: user.uid,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        };
    }
}
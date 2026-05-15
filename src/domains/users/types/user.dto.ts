import { UserRole } from "../entity/user.entity";

export interface RegisterUserDTO {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
}

export interface LoginUserDTO {
    email: string;
    password: string;
}

export interface AuthResponseDTO {
    user: {
        uid: string;
        name: string;
        email: string;
        role: UserRole;
    };
    token: string;
}
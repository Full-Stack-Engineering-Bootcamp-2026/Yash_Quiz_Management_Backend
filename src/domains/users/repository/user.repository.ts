import { Service } from "typedi";
import { Repository } from "typeorm";
import { AppDataSource } from "../../../db/db";
import { User } from "../entity/user.entity";

@Service()
export class UserRepository {
    private userRepo: Repository<User>;

    constructor() {
        this.userRepo = AppDataSource.getRepository(User);
    }

    public async findByEmail(email: string): Promise<User | null> {
        return await this.userRepo.findOne({ where: { email } });
    }

    public async saveUser(user: Partial<User>): Promise<User> {
        const newUser = this.userRepo.create(user);
        return await this.userRepo.save(newUser);
    }
}
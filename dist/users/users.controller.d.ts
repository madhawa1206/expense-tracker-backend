import { UsersService } from './users.service';
import { CreateUserDto, LoginUserDto } from './dto/user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    register(createUserDto: CreateUserDto): Promise<import("./schemas/user.schema/user.schema").User>;
    login(loginUserDto: LoginUserDto): Promise<{
        access_token: string;
    } | {
        error: string;
    }>;
}

import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, LoginUserDto } from './dto/user.dto';
import { User, UserDocument } from './schemas/user.schema/user.schema';
export declare class UsersService {
    private userModel;
    private jwtService;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService);
    register(createUserDto: CreateUserDto): Promise<User>;
    login(loginUserDto: LoginUserDto): Promise<{
        access_token: string;
    } | {
        error: string;
    }>;
}

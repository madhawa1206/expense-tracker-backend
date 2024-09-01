import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, LoginUserDto } from './dto/user.dto';
import { User, UserDocument } from './schemas/user.schema/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;

    const existingUser = await this.userModel.findOne({ username }).exec();
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ username, password: hashedPassword });
    return newUser.save();
  }

  // async login(loginUserDto: LoginUserDto): Promise<{ access_token: string }> {
  //   const { username, password } = loginUserDto;

  //   const user = await this.userModel.findOne({ username }).exec();
  //   if (!user || !(await bcrypt.compare(password, user.password))) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }

  //   const payload = { username: user.username, sub: user._id };
  //   return {
  //     access_token: this.jwtService.sign(payload),
  //   };
  // }

  async login(
    loginUserDto: LoginUserDto,
  ): Promise<{ access_token: string } | { error: string }> {
    const { username, password } = loginUserDto;

    try {
      const user = await this.userModel.findOne({ username }).exec();
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return { error: 'Invalid credentials' };
      }

      const payload = { username: user.username, sub: user._id };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      // Log the error for further inspection
      console.error('Login Error:', error);

      if (error instanceof UnauthorizedException) {
        throw error; // Re-throw the UnauthorizedException to be caught by the client
      }

      // For other unexpected errors, throw a generic internal server error
      throw new InternalServerErrorException(
        'An unexpected error occurred during login',
      );
    }
  }
}

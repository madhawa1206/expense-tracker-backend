import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'john_doe' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'strong_password' })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class LoginUserDto {
  @ApiProperty({ example: 'john_doe' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'strong_password' })
  @IsNotEmpty()
  @IsString()
  password: string;
}

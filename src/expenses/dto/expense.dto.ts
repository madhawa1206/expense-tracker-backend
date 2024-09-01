import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateExpenseDto {
  @ApiProperty({ example: 'Grocery Shopping' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: '2024-08-30' })
  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @ApiProperty({ example: 1000 })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'Food' })
  @IsNotEmpty()
  @IsString()
  type: string;
}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import {
  Expense,
  ExpenseSchema,
} from './schemas/expense.schema/expense.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Expense.name, schema: ExpenseSchema }]),
    AuthModule,
  ],
  controllers: [ExpensesController],
  providers: [ExpensesService],
})
export class ExpensesModule {}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Expense,
  ExpenseDocument,
} from './schemas/expense.schema/expense.schema';
import { CreateExpenseDto } from './dto/expense.dto';
import { startOfMonth, endOfMonth } from 'date-fns';

@Injectable()
export class ExpensesService {
  private readonly MAX_MONTHLY_EXPENSE = 10000;

  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<ExpenseDocument>,
  ) {}

  private async getMonthlyExpenseTotal(
    userId: string,
    date: Date,
  ): Promise<number> {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const expenses = await this.expenseModel
      .find({
        userId,
        date: { $gte: start, $lte: end },
      })
      .exec();
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }

  async create(
    createExpenseDto: CreateExpenseDto,
    userId: string,
  ): Promise<Expense | { error: string }> {
    const date = createExpenseDto.date;
    if (!date) {
      throw new BadRequestException('Date is required');
    }

    const totalExpenses = await this.getMonthlyExpenseTotal(
      userId,
      new Date(date),
    );
    const newExpenseTotal = totalExpenses + createExpenseDto.amount;

    if (newExpenseTotal > this.MAX_MONTHLY_EXPENSE) {
      return { error: 'Monthly expense limit exceeded' };
    }

    const newExpense = new this.expenseModel({ ...createExpenseDto, userId });
    return newExpense.save();
  }

  async update(
    id: string,
    userId: string,
    createExpenseDto: CreateExpenseDto,
  ): Promise<Expense | { error: string }> {
    const date = createExpenseDto.date;
    if (!date) {
      throw new BadRequestException('Date is required');
    }

    const existingExpense = await this.expenseModel
      .findOne({ _id: id, userId })
      .exec();
    if (!existingExpense) {
      throw new NotFoundException(`Expense #${id} not found`);
    }

    const totalExpensesBeforeUpdate = await this.getMonthlyExpenseTotal(
      userId,
      new Date(date),
    );
    const totalExpensesAfterUpdate =
      totalExpensesBeforeUpdate -
      existingExpense.amount +
      createExpenseDto.amount;

    if (totalExpensesAfterUpdate > this.MAX_MONTHLY_EXPENSE) {
      return { error: 'Monthly expense limit exceeded' };
    }

    const updatedExpense = await this.expenseModel
      .findOneAndUpdate(
        { _id: id, userId },
        { ...createExpenseDto },
        { new: true },
      )
      .exec();
    if (!updatedExpense) {
      throw new NotFoundException(`Expense #${id} not found`);
    }
    return updatedExpense;
  }

  async findAll(userId: string): Promise<Expense[]> {
    return this.expenseModel.find({ userId }).exec();
  }

  async findOne(id: string, userId: string): Promise<Expense> {
    const expense = await this.expenseModel.findOne({ _id: id, userId }).exec();
    if (!expense) {
      throw new NotFoundException(`Expense #${id} not found`);
    }
    return expense;
  }

  async delete(id: string, userId: string): Promise<void> {
    const objectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;

    const result = await this.expenseModel
      .findByIdAndDelete({ _id: objectId, userId })
      .exec();

    if (!result) {
      throw new NotFoundException(
        `Expense #${id} not found for user #${userId}`,
      );
    }
  }

  async findByDate(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Expense[]> {
    try {
      return this.expenseModel
        .find({
          userId,
          date: { $gte: startDate, $lte: endDate },
        })
        .exec();
    } catch (error) {
      console.error('Error in findByDate:', error);
      throw new BadRequestException('Error fetching expenses by date');
    }
  }
}

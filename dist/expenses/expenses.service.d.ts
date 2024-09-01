import { Model } from 'mongoose';
import { Expense, ExpenseDocument } from './schemas/expense.schema/expense.schema';
import { CreateExpenseDto } from './dto/expense.dto';
export declare class ExpensesService {
    private expenseModel;
    private readonly MAX_MONTHLY_EXPENSE;
    constructor(expenseModel: Model<ExpenseDocument>);
    private getMonthlyExpenseTotal;
    create(createExpenseDto: CreateExpenseDto, userId: string): Promise<Expense | {
        error: string;
    }>;
    update(id: string, userId: string, createExpenseDto: CreateExpenseDto): Promise<Expense | {
        error: string;
    }>;
    findAll(userId: string): Promise<Expense[]>;
    findOne(id: string, userId: string): Promise<Expense>;
    delete(id: string, userId: string): Promise<void>;
    findByDate(userId: string, startDate: Date, endDate: Date): Promise<Expense[]>;
}

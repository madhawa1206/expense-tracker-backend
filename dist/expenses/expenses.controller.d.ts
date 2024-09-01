import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/expense.dto';
interface AuthRequest extends Request {
    user: {
        sub: string;
    };
}
export declare class ExpensesController {
    private readonly expensesService;
    constructor(expensesService: ExpensesService);
    create(createExpenseDto: CreateExpenseDto, req: AuthRequest): Promise<import("./schemas/expense.schema/expense.schema").Expense | {
        error: string;
    }>;
    findAll(req: AuthRequest): Promise<import("./schemas/expense.schema/expense.schema").Expense[]>;
    findOne(id: string, req: AuthRequest): Promise<import("./schemas/expense.schema/expense.schema").Expense>;
    update(id: string, createExpenseDto: CreateExpenseDto, req: AuthRequest): Promise<import("./schemas/expense.schema/expense.schema").Expense | {
        error: string;
    }>;
    delete(id: string, req: AuthRequest): Promise<void>;
    findByDate(req: AuthRequest, dateFrom: string, dateTo: string): Promise<import("./schemas/expense.schema/expense.schema").Expense[]>;
}
export {};

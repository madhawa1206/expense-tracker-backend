"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpensesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const expense_schema_1 = require("./schemas/expense.schema/expense.schema");
const date_fns_1 = require("date-fns");
let ExpensesService = class ExpensesService {
    constructor(expenseModel) {
        this.expenseModel = expenseModel;
        this.MAX_MONTHLY_EXPENSE = 10000;
    }
    async getMonthlyExpenseTotal(userId, date) {
        const start = (0, date_fns_1.startOfMonth)(date);
        const end = (0, date_fns_1.endOfMonth)(date);
        const expenses = await this.expenseModel
            .find({
            userId,
            date: { $gte: start, $lte: end },
        })
            .exec();
        return expenses.reduce((sum, expense) => sum + expense.amount, 0);
    }
    async create(createExpenseDto, userId) {
        const date = createExpenseDto.date;
        if (!date) {
            throw new common_1.BadRequestException('Date is required');
        }
        const totalExpenses = await this.getMonthlyExpenseTotal(userId, new Date(date));
        const newExpenseTotal = totalExpenses + createExpenseDto.amount;
        if (newExpenseTotal > this.MAX_MONTHLY_EXPENSE) {
            return { error: 'Monthly expense limit exceeded' };
        }
        const newExpense = new this.expenseModel(Object.assign(Object.assign({}, createExpenseDto), { userId }));
        return newExpense.save();
    }
    async update(id, userId, createExpenseDto) {
        const date = createExpenseDto.date;
        if (!date) {
            throw new common_1.BadRequestException('Date is required');
        }
        const existingExpense = await this.expenseModel
            .findOne({ _id: id, userId })
            .exec();
        if (!existingExpense) {
            throw new common_1.NotFoundException(`Expense #${id} not found`);
        }
        const totalExpensesBeforeUpdate = await this.getMonthlyExpenseTotal(userId, new Date(date));
        const totalExpensesAfterUpdate = totalExpensesBeforeUpdate -
            existingExpense.amount +
            createExpenseDto.amount;
        if (totalExpensesAfterUpdate > this.MAX_MONTHLY_EXPENSE) {
            return { error: 'Monthly expense limit exceeded' };
        }
        const updatedExpense = await this.expenseModel
            .findOneAndUpdate({ _id: id, userId }, Object.assign({}, createExpenseDto), { new: true })
            .exec();
        if (!updatedExpense) {
            throw new common_1.NotFoundException(`Expense #${id} not found`);
        }
        return updatedExpense;
    }
    async findAll(userId) {
        return this.expenseModel.find({ userId }).exec();
    }
    async findOne(id, userId) {
        const expense = await this.expenseModel.findOne({ _id: id, userId }).exec();
        if (!expense) {
            throw new common_1.NotFoundException(`Expense #${id} not found`);
        }
        return expense;
    }
    async delete(id, userId) {
        const objectId = mongoose_2.Types.ObjectId.isValid(id) ? new mongoose_2.Types.ObjectId(id) : id;
        const result = await this.expenseModel
            .findByIdAndDelete({ _id: objectId, userId })
            .exec();
        if (!result) {
            throw new common_1.NotFoundException(`Expense #${id} not found for user #${userId}`);
        }
    }
    async findByDate(userId, startDate, endDate) {
        try {
            return this.expenseModel
                .find({
                userId,
                date: { $gte: startDate, $lte: endDate },
            })
                .exec();
        }
        catch (error) {
            console.error('Error in findByDate:', error);
            throw new common_1.BadRequestException('Error fetching expenses by date');
        }
    }
};
exports.ExpensesService = ExpensesService;
exports.ExpensesService = ExpensesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(expense_schema_1.Expense.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ExpensesService);
//# sourceMappingURL=expenses.service.js.map
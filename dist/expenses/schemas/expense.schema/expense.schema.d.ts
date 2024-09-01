import { Document } from 'mongoose';
export type ExpenseDocument = Expense & Document;
export declare class Expense {
    description: string;
    date: Date;
    amount: number;
    type: string;
    userId: string;
}
export declare const ExpenseSchema: import("mongoose").Schema<Expense, import("mongoose").Model<Expense, any, any, any, Document<unknown, any, Expense> & Expense & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Expense, Document<unknown, {}, import("mongoose").FlatRecord<Expense>> & import("mongoose").FlatRecord<Expense> & {
    _id: import("mongoose").Types.ObjectId;
}>;

import expenseDB from '../repository/expense.db';
import { IExpense } from '../model/Expense';
import {
    CreateExpenseDTO,
    DeleteExpenseDTO,
    UpdateExpenseDTO,
    GetExpenseByUserIdDTO,
} from '../dtos/Expense';

export class ExpenseService {
    async createExpense(
        data: CreateExpenseDTO
    ): Promise<{ success: boolean; message?: string; expense?: IExpense }> {
        try {
            const expense = await expenseDB.createExpense(data);
            return { success: true, expense };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Failed to create expense' };
        }
    }

    async getExpenseByUserId(
        data: GetExpenseByUserIdDTO
    ): Promise<{ success: boolean; message?: string; expenses?: IExpense[] }> {
        try {
            const expenses = await expenseDB.getExpenseByUserId(data);
            return { success: true, expenses };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Failed to retrieve expenses' };
        }
    }

    async updateExpense(
        data: UpdateExpenseDTO
    ): Promise<{ success: boolean; message?: string; expenseId?: string }> {
        try {
            const result = await expenseDB.updateExpense(data);
            if (result) {
                return { success: true, expenseId: result.id.toString() };
            }
            return { success: false, message: 'Expense not found' };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Failed to update expense' };
        }
    }

    async deleteExpense(
        data: DeleteExpenseDTO
    ): Promise<{ success: boolean; message?: string; expenseId?: string }> {
        try {
            const result = await expenseDB.deleteExpense(data);
            if (result) {
                return { success: true, expenseId: result.id.toString() };
            }
            return { success: false, message: 'Expense not found' };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Failed to delete expense' };
        }
    }
}

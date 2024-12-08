import { prismaClient } from '../util/prismaClient';
import {
    CreateExpenseDTO,
    DeleteExpenseDTO,
    DeleteExpenseResponseDTO,
    GetExpenseByUserIdDTO,
    UpdateExpenseDTO,
    UpdateExpenseResponseDTO,
} from '../dtos/Expense';
import { IExpense } from '../model/Expense';

const createExpense = async (data: CreateExpenseDTO): Promise<IExpense> => {
    try {
        const expense = await prismaClient.expense.create({
            data,
        });
        return expense;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getExpenseByUserId = async (data: GetExpenseByUserIdDTO): Promise<IExpense[]> => {
    try {
        return await prismaClient.expense.findMany({ where: { userId: data.userId } });
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const updateExpense = async (data: UpdateExpenseDTO): Promise<UpdateExpenseResponseDTO | null> => {
    try {
        await prismaClient.expense.update({ where: { id: data.id }, data });
        return { id: data.id };
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const deleteExpense = async (data: DeleteExpenseDTO): Promise<DeleteExpenseResponseDTO | null> => {
    try {
        await prismaClient.expense.delete({ where: { id: data.id } });
        return { id: data.id };
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export default { createExpense, getExpenseByUserId, updateExpense, deleteExpense };

import { axios } from '../lib/axios';
import { Expense, ExpenseFormInput, User } from '../types';

const baseUrl = '/expenses';

export const createExpense = async (
    expenseData: ExpenseFormInput,
    userId: User['id']
): Promise<Expense> => {
    try {
        const response = await axios.post(baseUrl, {
            ...expenseData,
            userId,
        });
        return response.data;
    } catch (error) {
        console.error('Error creating expense:', error);
        throw error;
    }
};

export const updateExpense = async (
    expenseId: number,
    expenseData: ExpenseFormInput,
    userId: User['id']
): Promise<Expense> => {
    try {
        const response = await axios.put(`${baseUrl}/${expenseId}`, {
            ...expenseData,
            userId,
        });
        return response.data;
    } catch (error) {
        console.error('Error updating expense:', error);
        throw error;
    }
};

export const deleteExpense = async (expenseId: number): Promise<void> => {
    try {
        await axios.delete(`${baseUrl}/${expenseId}`);
    } catch (error) {
        console.error('Error deleting expense:', error);
        throw error;
    }
};

export const fetchExpensesByCategory = async (categoryId: number): Promise<Expense[]> => {
    try {
        const response = await axios.get(`${baseUrl}/category/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching expenses:', error);
        throw error;
    }
};

export const fetchExpensesByUser = async (userId: User['id']): Promise<Expense[]> => {
    try {
        const response = await axios.get(`${baseUrl}/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user expenses:', error);
        throw error;
    }
};

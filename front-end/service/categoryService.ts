import { axios } from '../lib/axios';
import { Category, CategoryFormInput, User } from '../types';

const baseUrl = '/categories';

export const fetchCategories = async (userId: User['id']): Promise<Category[]> => {
    try {
        const response = await axios.get(`${baseUrl}/user/${userId}`);
        return response.data.map((category: Category) => {
            const totalSpent = category.expenses.reduce((sum, expense) => sum + expense.amount, 0);

            return {
                ...category,
                totalSpent,
                remaining: category.budget - totalSpent,
            };
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

export const createCategory = async (
    categoryData: CategoryFormInput,
    userId: User['id']
): Promise<Category> => {
    try {
        const response = await axios.post(baseUrl, {
            ...categoryData,
            userId,
        });
        return response.data;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
};

export const updateCategory = async (
    categoryId: number,
    categoryData: CategoryFormInput,
    userId: User['id']
): Promise<Category> => {
    try {
        const response = await axios.put(`${baseUrl}/${categoryId}`, {
            ...categoryData,
            userId,
        });
        return response.data;
    } catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
};

export const deleteCategory = async (categoryId: number): Promise<void> => {
    try {
        await axios.delete(`${baseUrl}/${categoryId}`);
    } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
    }
};

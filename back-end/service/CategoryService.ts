import categoryDB from '../repository/category.db';
import { ICategory } from '../model/Category';
import {
    CreateCategoryDTO,
    DeleteCategoryDTO,
    UpdateCategoryDTO,
    GetCategoryByUserIdDTO,
    GetMonthlyCategoryStatisticsDTO,
    GetMonthlyCategoryStatisticsResponseDTO,
} from '../dtos/Category';

export class CategoryService {
    async createCategory(
        data: CreateCategoryDTO
    ): Promise<{ success: boolean; message?: string; category?: ICategory }> {
        try {
            const category = await categoryDB.createCategory(data);
            return { success: true, category };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Failed to create category' };
        }
    }

    async getCategoryByUserId(
        data: GetCategoryByUserIdDTO
    ): Promise<{ success: boolean; message?: string; categories?: ICategory[] }> {
        try {
            const categories = await categoryDB.getCategoryByUserId(data);
            return { success: true, categories };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Failed to retrieve categories' };
        }
    }

    async updateCategory(
        data: UpdateCategoryDTO
    ): Promise<{ success: boolean; message?: string; categoryId?: string }> {
        try {
            const result = await categoryDB.updateCategory(data);
            if (result) {
                return { success: true, categoryId: result.id.toString() };
            }
            return { success: false, message: 'Category not found' };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Failed to update category' };
        }
    }

    async deleteCategory(
        data: DeleteCategoryDTO
    ): Promise<{ success: boolean; message?: string; categoryId?: string }> {
        try {
            const result = await categoryDB.deleteCategory(data);
            if (result) {
                return { success: true, categoryId: result.id.toString() };
            }
            return { success: false, message: 'Category not found' };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Failed to delete category' };
        }
    }

    async getMonthlyCategoryStatistics(data: GetMonthlyCategoryStatisticsDTO): Promise<{
        success: boolean;
        message?: string;
        statistics?: GetMonthlyCategoryStatisticsResponseDTO;
    }> {
        try {
            const statistics = await categoryDB.getMonthlyCategoryStatisticsByUserId(data);
            if (statistics) {
                return { success: true, statistics };
            }
            return { success: false, message: 'No statistics found' };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Failed to retrieve category statistics' };
        }
    }
}

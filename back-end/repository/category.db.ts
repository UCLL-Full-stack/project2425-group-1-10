import { prismaClient } from '../util/prismaClient';
import {
    CreateCategoryDTO,
    DeleteCategoryDTO,
    DeleteCategoryResponseDTO,
    GetCategoryByUserIdDTO,
    UpdateCategoryDTO,
    UpdateCategoryResponseDTO,
    GetMonthlyCategoryStatisticsDTO,
    GetMonthlyCategoryStatisticsResponseDTO,
} from '../dtos/Category';
import { ICategory } from '../model/Category';

const createCategory = async (data: CreateCategoryDTO): Promise<ICategory> => {
    try {
        const category = await prismaClient.category.create({
            data,
        });
        return category;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getCategoryByUserId = async (data: GetCategoryByUserIdDTO): Promise<ICategory[]> => {
    try {
        return await prismaClient.category.findMany({
            where: { userId: data.userId },
            include: { expenses: true },
        });
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const updateCategory = async (
    data: UpdateCategoryDTO
): Promise<UpdateCategoryResponseDTO | null> => {
    try {
        await prismaClient.category.update({ where: { id: data.id }, data });
        return { id: data.id };
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const deleteCategory = async (
    data: DeleteCategoryDTO
): Promise<DeleteCategoryResponseDTO | null> => {
    try {
        await prismaClient.category.delete({ where: { id: data.id } });
        return { id: data.id };
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};
const getMonthlyCategoryStatisticsByUserId = async (
    data: GetMonthlyCategoryStatisticsDTO
): Promise<GetMonthlyCategoryStatisticsResponseDTO | null> => {
    try {
        return prismaClient.$queryRaw`
        SELECT 
          c.name as category_name,
          DATE_TRUNC('month', e.date) as month,
          COALESCE(SUM(e.amount), 0)::float as total_amount,
          c.budget::float as budget,
          (c.budget - COALESCE(SUM(e.amount), 0))::float as remaining
        FROM "Category" c
        LEFT JOIN "Expense" e ON c.id = e."categoryId"
        WHERE c."userId" = ${data.userId}
        GROUP BY c.name, c.budget, DATE_TRUNC('month', e.date)
            ORDER BY month DESC, category_name ASC
        `;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export default {
    createCategory,
    getCategoryByUserId,
    updateCategory,
    deleteCategory,
    getMonthlyCategoryStatisticsByUserId,
};

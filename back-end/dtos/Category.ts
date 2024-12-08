export interface CreateCategoryDTO {
    name: string;
    budget: number;
    userId: number;
}
export interface GetCategoryByUserIdDTO {
    userId: number;
}
export interface DeleteCategoryDTO {
    id: number;
}

export interface DeleteCategoryResponseDTO {
    id: number;
}
export interface UpdateCategoryDTO {
    id: number;
    name: string;
    budget: number;
}

export interface UpdateCategoryResponseDTO {
    id: number;
}

export interface GetMonthlyCategoryStatisticsDTO {
    userId: number;
}

export interface GetMonthlyCategoryStatisticsResponseDTO {
    category_name: string;
    month: string;
    total_amount: number;
    budget: number;
    remaining: number;
}

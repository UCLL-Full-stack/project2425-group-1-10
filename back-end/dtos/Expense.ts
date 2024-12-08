export interface CreateExpenseDTO {
    description: string;
    amount: number;
    categoryId: number;
    userId: number;
    date: Date;
}
export interface GetExpenseByUserIdDTO {
    userId: number;
}

export interface DeleteExpenseDTO {
    id: number;
}

export interface DeleteExpenseResponseDTO {
    id: number;
}

export interface UpdateExpenseDTO {
    id: number;
    description: string;
    amount: number;
}

export interface UpdateExpenseResponseDTO {
    id: number;
}

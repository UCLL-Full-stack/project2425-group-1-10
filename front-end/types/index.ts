export interface User {
    id: string;
    name: string;
    password: string;
    email: string;
}

export interface Category {
    id: number;
    name: string;
    budget: number;
    totalSpent: number;
    remaining: number;
    expenses: Expense[];
}

export interface CategoryFormInput {
    name: string;
    budget: number;
}

export interface Expense {
    id: number;
    description: string;
    amount: number;
    categoryId: number;
    date: Date;
}

export interface ExpenseFormInput {
    description: string;
    amount: number;
    categoryId: number;
    date: Date;
}

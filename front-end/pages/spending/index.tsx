import { CreateExpenseForm } from '@components/speding/CreateExpenseForm';
import { SpendingStatus } from '@components/speding/SpendingStatus';
import { Category } from '@types';
import { useSession } from 'next-auth/react';
import { useEffect, useState, useRef } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { fetchCategories, deleteCategory } from 'service/categoryService';
import { CreateCategoryForm } from '@components/speding/CreateCategory';
import { deleteExpense } from 'service/expenseService';
import { NotificationModal } from '@components/common/NotificationModal';

const Spending = () => {
    const session = useSession();
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const latestCategoryRef = useRef<HTMLDivElement>(null);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
    const [isCategoryDeleteModalOpen, setIsCategoryDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

    const refreshCategories = async () => {
        if (!session.data) return;
        setIsLoadingCategories(true);
        try {
            const res = await fetchCategories(session.data.user.id);
            setCategories(res);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setIsLoadingCategories(false);
        }
    };

    useEffect(() => {
        if (session.data) {
            refreshCategories();
        }
    }, [session.data]);

    const handleDeleteExpense = async (expenseId: string) => {
        if (!session.data) return;
        setExpenseToDelete(expenseId);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!expenseToDelete || !session.data) return;

        try {
            await deleteExpense(Number(expenseToDelete));
            refreshCategories();
        } catch (error) {
            console.error('Error deleting expense:', error);
        } finally {
            setIsDeleteModalOpen(false);
            setExpenseToDelete(null);
        }
    };

    const handleDeleteCategory = (category: Category) => {
        setCategoryToDelete(category);
        setIsCategoryDeleteModalOpen(true);
    };

    const confirmCategoryDelete = async () => {
        if (!categoryToDelete || !session.data) return;

        try {
            await deleteCategory(categoryToDelete.id);
            refreshCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
        } finally {
            setIsCategoryDeleteModalOpen(false);
            setCategoryToDelete(null);
        }
    };

    if (session.status === 'loading' || isLoadingCategories) {
        return <div>Loading...</div>;
    }
    if (session.status === 'unauthenticated') {
        return <div>Unauthenticated</div>;
    }

    return (
        <div>
            <div className="min-h-[100vh-240px] max-w-6xl mx-auto w-full bg-rose-400 p-6 relative">
                <SpendingStatus categories={categories} />
                <h1 className="text-4xl font-bold text-center mb-12 text-black">
                    Spending Categories
                </h1>
                <div className="flex gap-6 h-[calc(100vh-220px)]">
                    <div className="flex-1 overflow-x-auto">
                        <div className="flex gap-6 min-w-max h-full">
                            {isLoadingCategories ? (
                                <div className="w-full flex justify-center items-center">
                                    <p>Loading categories...</p>
                                </div>
                            ) : (
                                categories.map((category: Category, index: number) => (
                                    <div
                                        key={category.id}
                                        data-category-id={category.id}
                                        className="w-72 flex flex-col"
                                        ref={
                                            index === categories.length - 1
                                                ? latestCategoryRef
                                                : null
                                        }
                                    >
                                        <div className="px-2">
                                            <div className="flex justify-between items-center pb-1">
                                                <h2 className="text-lg text-center font-semibold text-black">
                                                    {category.name}
                                                </h2>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedCategory(category);
                                                            setIsCategoryModalOpen(true);
                                                        }}
                                                        className="bg-black text-white p-1.5 rounded-full hover:bg-gray-800"
                                                    >
                                                        <FaEdit size={12} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteCategory(category)
                                                        }
                                                        className="bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700"
                                                    >
                                                        <FaTrash size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="mb-4">
                                                <div className="text-xs text-gray-900">
                                                    Spent: ${category.totalSpent.toFixed(2)}
                                                </div>
                                                <div className="text-xs text-gray-900">
                                                    Remaining: ${category.remaining.toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-4 bg-gray-200 border-2 border-black">
                                            <div className="space-y-2 text-black">
                                                {category?.expenses?.length > 0 ? (
                                                    category.expenses.map((expense) => (
                                                        <div
                                                            key={expense.id}
                                                            className="flex justify-between items-center gap-4"
                                                        >
                                                            <p>
                                                                - {expense.description}: $
                                                                {expense.amount.toFixed(2)} &nbsp;
                                                                {new Date(
                                                                    expense.date
                                                                ).toLocaleDateString('en-GB', {
                                                                    day: '2-digit',
                                                                    month: '2-digit',
                                                                })}
                                                            </p>
                                                            <button
                                                                onClick={() =>
                                                                    handleDeleteExpense(
                                                                        String(expense.id)
                                                                    )
                                                                }
                                                                className="text-red-600 hover:text-red-800"
                                                                title="Delete expense"
                                                            >
                                                                <FaTrash size={12} />
                                                            </button>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p>No expenses for this category</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="flex justify-center items-center">
                        <button
                            onClick={() => setIsCategoryModalOpen(true)}
                            className="bg-black text-white p-2 rounded-full"
                        >
                            <FaPlus />
                        </button>
                    </div>
                    <div className="w-72 h-full overflow-hidden shrink-0 flex flex-col">
                        <h2 className="text-lg text-center font-semibold pb-3 text-black">
                            New Expense
                        </h2>
                        <div>
                            <CreateExpenseForm
                                categories={categories}
                                onSuccess={refreshCategories}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <CreateCategoryForm
                categories={categories}
                category={selectedCategory}
                onSuccess={() => {
                    setSelectedCategory(null);
                    refreshCategories();
                }}
                isOpen={isCategoryModalOpen}
                onClose={() => {
                    setIsCategoryModalOpen(false);
                    setSelectedCategory(null);
                }}
            />
            <NotificationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setExpenseToDelete(null);
                }}
                type="error"
                title="Delete Expense"
                description="Are you sure you want to delete this expense?"
                onConfirm={confirmDelete}
            />
            <NotificationModal
                isOpen={isCategoryDeleteModalOpen}
                onClose={() => {
                    setIsCategoryDeleteModalOpen(false);
                    setCategoryToDelete(null);
                }}
                type="error"
                title="Delete Category"
                description={`Are you sure you want to delete the category "${categoryToDelete?.name}"? This will also delete all expenses in this category.`}
                onConfirm={confirmCategoryDelete}
            />
        </div>
    );
};

export default Spending;

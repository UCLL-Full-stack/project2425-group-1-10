import React, { useState } from 'react';
import { Category } from '@types';
import { createExpense } from 'service/expenseService';
import { useSession } from 'next-auth/react';
import { NotificationModal } from 'components/common/NotificationModal';

interface CreateExpenseFormProps {
    categories: Category[];
    onSuccess?: (categoryId: number) => void;
}

const CreateExpenseForm: React.FC<CreateExpenseFormProps> = ({ categories, onSuccess }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [expense, setExpense] = useState({
        categoryId: '',
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
    });
    const [error, setError] = useState<{
        categoryId?: string;
        description?: string;
        amount?: string;
        date?: string;
    }>({});
    const session = useSession();
    const [notification, setNotification] = useState<{
        isOpen: boolean;
        type: 'success' | 'error';
        title: string;
        description: string;
    } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setExpense((prev) => ({ ...prev, [name]: value }));
        setError((prev) => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Basic validation
        const newError: { [key: string]: string } = {};
        if (!expense.categoryId) newError.categoryId = 'Category is required';
        if (!expense.description) newError.description = 'Description is required';
        if (!expense.amount) newError.amount = 'Amount is required';
        if (!expense.date) newError.date = 'Date is required';
        if (Object.keys(newError).length > 0) {
            setError(newError);
            setIsSubmitting(false);
            return;
        }
        try {
            if (session.data?.user?.id) {
                await createExpense(
                    {
                        description: expense.description,
                        categoryId: Number(expense.categoryId),
                        amount: Number(expense.amount),
                        date: new Date(expense.date),
                    },
                    session.data.user.id
                );
                // Reset form
                setExpense({
                    categoryId: '',
                    description: '',
                    amount: '',
                    date: new Date().toISOString(),
                });
                // Call onSuccess with categoryId
                if (onSuccess && expense.categoryId) {
                    onSuccess(Number(expense.categoryId));
                }

                setNotification({
                    isOpen: true,
                    type: 'success',
                    title: 'Success',
                    description: `Expense ${expense.description} has been added successfully!`,
                });
            }
        } catch (error) {
            setNotification({
                isOpen: true,
                type: 'error',
                title: 'Error',
                description: 'Failed to create expense. Please try again.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="flex justify-center items-center p-2.5">
                <div className="flex flex-col items-center p-8 border-2 border-black max-w-[600px] w-full bg-[#f8eaea] rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-5">Create Expense</h2>
                    <form onSubmit={handleSubmit} className="w-full">
                        <div className="h-[300px] overflow-y-scroll px-2">
                            <div className="mb-4">
                                <label className="font-bold block mb-1 w-full">Category</label>
                                <select
                                    name="categoryId"
                                    value={expense.categoryId}
                                    onChange={handleChange}
                                    className="w-full p-2.5 border-2 border-black rounded"
                                >
                                    <option value="">Select category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name} (Remaining: $
                                            {category.remaining.toFixed(2)})
                                        </option>
                                    ))}
                                </select>
                                {error.categoryId && (
                                    <div className="text-black mt-1">{error.categoryId}</div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="font-bold block mb-1 w-full">Description</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={expense.description}
                                    onChange={handleChange}
                                    placeholder="e.g., Grocery shopping"
                                    className="w-full p-2.5 border-2 border-black rounded"
                                />
                                {error.description && (
                                    <div className="text-black mt-1">{error.description}</div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="font-bold block mb-1 w-full">Amount</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={expense.amount}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    className="w-full p-2.5 border-2 border-black rounded"
                                />
                                {error.amount && (
                                    <div className="text-black mt-1">{error.amount}</div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="font-bold block mb-1 w-full">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={expense.date}
                                    onChange={handleChange}
                                    className="w-full p-2.5 border-2 border-black rounded"
                                />
                                {error.date && <div className="text-black mt-1">{error.date}</div>}
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`p-3 bg-[#cccccc] border-2 border-black cursor-pointer w-full font-bold rounded ${
                                isSubmitting ? 'opacity-50' : 'opacity-100'
                            }`}
                        >
                            {isSubmitting ? 'Adding expense...' : 'Add Expense'}
                        </button>
                    </form>
                </div>
            </div>

            {notification && (
                <NotificationModal
                    isOpen={notification.isOpen}
                    onClose={() => setNotification(null)}
                    type={notification.type}
                    title={notification.title}
                    description={notification.description}
                />
            )}
        </>
    );
};

export { CreateExpenseForm };

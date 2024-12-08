import React, { useState, useEffect, useRef } from 'react';
import { CategoryFormInput, Category } from '@types';
import { createCategory, updateCategory } from '../../service/categoryService';
import { useSession } from 'next-auth/react';
import { NotificationModal } from 'components/common/NotificationModal';

interface CreateCategoryFormProps {
    category?: Category | null;
    categories: Category[];
    onSuccess?: (data: CategoryFormInput, isUpdate: boolean) => void;
    isOpen: boolean;
    onClose: () => void;
}

const CreateCategoryForm: React.FC<CreateCategoryFormProps> = ({
    category,
    categories,
    onSuccess,
    isOpen,
    onClose,
}: CreateCategoryFormProps) => {
    console.log('category', category);
    const [formData, setFormData] = useState({
        name: category?.name || '',
        budget: category?.budget || '',
    });
    console.log('formData', formData);
    const [error, setError] = useState<{ name?: string; budget?: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data: session } = useSession();
    const [notification, setNotification] = useState<{
        isOpen: boolean;
        type: 'success' | 'error';
        title: string;
        description: string;
    } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError((prev) => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Basic validation
        const newError: { name?: string; budget?: string } = {};
        if (!formData.name) newError.name = 'Category name is required';
        if (!formData.budget) newError.budget = 'Budget is required';

        setError(newError);
        if (Object.keys(newError).length > 0) {
            setIsSubmitting(false);
            return;
        }

        try {
            const data = {
                name: formData.name,
                budget: Number(formData.budget),
            };
            const userId = session?.user?.id;
            if (!userId) {
                throw new Error('User ID is required');
            }

            if (category) {
                await updateCategory(category.id, data, userId);
            } else {
                await createCategory(data, userId);
            }

            if (onSuccess) {
                onSuccess(data, !!category);
            }

            setFormData({ name: '', budget: '' });
            onClose();
            setNotification({
                isOpen: true,
                type: 'success',
                title: 'Success',
                description: `Category ${data.name} has been ${
                    category ? 'updated' : 'created'
                } successfully!`,
            });
        } catch (error) {
            setNotification({
                isOpen: true,
                type: 'error',
                title: 'Error',
                description: `Failed to ${
                    category ? 'update' : 'create'
                } category. Please try again.`,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const latestCategoryRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (category) {
            setFormData({ name: category.name, budget: category.budget.toString() });
        }
    }, [category]);

    useEffect(() => {
        if (latestCategoryRef.current) {
            latestCategoryRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }
    }, [categories.length]);

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
                <div className="flex justify-center p-5 max-h-[90vh] overflow-auto">
                    <div className="flex flex-col items-center p-8 border-2 border-black max-w-[600px] w-full bg-[#f8eaea] rounded-lg shadow-md relative">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-black hover:text-gray-700"
                        >
                            ✕
                        </button>
                        <h2 className="text-2xl font-bold mb-5">
                            {category ? 'Update Category' : 'Create Category'}
                        </h2>
                        <form onSubmit={handleSubmit} className="w-full">
                            <div className="mb-4">
                                <label className="font-bold block mb-1 w-full">Category Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full p-2.5 border-2 border-black rounded"
                                />
                                {error.name && <div className="text-black mt-1">{error.name}</div>}
                            </div>

                            <div className="mb-4">
                                <label className="font-bold block mb-1 w-full">Budget</label>
                                <input
                                    type="number"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    className="w-full p-2.5 border-2 border-black rounded"
                                />
                                {error.budget && (
                                    <div className="text-black mt-1">{error.budget}</div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="p-3 bg-[#cccccc] border-2 border-black cursor-pointer w-full font-bold rounded"
                            >
                                {isSubmitting
                                    ? 'Saving...'
                                    : category
                                    ? 'Update Category'
                                    : 'Add Category'}
                            </button>
                        </form>
                    </div>
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

export { CreateCategoryForm };

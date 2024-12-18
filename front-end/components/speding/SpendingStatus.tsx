import { Category } from '@types';
import { useTranslation } from 'next-i18next';

const SpendingStatus = ({ categories }: { categories: Category[] }) => {

    const {t} = useTranslation('home');

    const getTotalBudgetStatus = () => {
        const totalSpent = categories.reduce((sum, category) => sum + category.totalSpent, 0);
        const totalBudget = categories.reduce((sum, category) => sum + category.budget, 0);
        const percentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

        return {
            totalSpent,
            totalBudget,
            percentage,
        };
    };

    return (
        <div className="absolute top-4 right-4 max-w-72">
            {(() => {
                const { totalSpent, totalBudget, percentage } = getTotalBudgetStatus();
                if (percentage >= 80 && percentage <= 100) {
                    return (
                        <div className="w-full max-w-md mb-4 p-3 bg-red-100 border border-red-500 rounded-lg shadow-md">
                            <p className="text-red-800 font-medium">
                                {t('home:warning_one')} {percentage}% {t('home:warning_two')}
                            </p>
                        </div>
                    );
                }
                if (percentage > 100) {
                    return (
                        <div className="w-full max-w-md mb-4 p-3 bg-red-100 border-2 border-red-500 rounded-lg">
                            <p className="text-red-600">
                                {t('home:warning_three')}
                                ${totalSpent.toFixed(2)} / {t('home:category_budget')}: ${totalBudget.toFixed(2)}
                            </p>
                        </div>
                    );
                }
                return null;
            })()}
        </div>
    );
};

export { SpendingStatus };

import { Category } from '@types';

const SpendingStatus = ({ categories }: { categories: Category[] }) => {
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
                                Notification: You have reached {percentage}% of your total budget
                                this month. Please review your expenses to stay within your
                                financial goals!
                            </p>
                        </div>
                    );
                }
                if (percentage > 100) {
                    return (
                        <div className="w-full max-w-md mb-4 p-3 bg-red-100 border-2 border-red-500 rounded-lg">
                            <p className="text-red-600">
                                Warning: You have exceeded your total budget for this month. Spent:
                                ${totalSpent.toFixed(2)} / Budget: ${totalBudget.toFixed(2)}
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

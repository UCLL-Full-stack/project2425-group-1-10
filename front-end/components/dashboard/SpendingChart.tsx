import React, { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { useSession } from 'next-auth/react';
import { axios } from '../../lib/axios';

interface CategoryStats {
    category_name: string;
    month: string;
    total_amount: number;
    budget?: number;
}

const SpendingChart: React.FC = () => {
    const { data: session, status } = useSession();
    const [monthlyStats, setMonthlyStats] = useState<CategoryStats[]>([]);
    const [availableMonths, setAvailableMonths] = useState<string[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<string>('');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchStats = async () => {
            if (!session?.user?.id) {
                setError('User not authenticated');
                return;
            }

            try {
                const response = await axios.get(`/categories/statistics/${session.user.id}`);
                const stats: CategoryStats[] = response.data;
                if (stats.length === 0) {
                    setError('No spending data available');
                    return;
                }

                const months = Array.from(
                    new Set(
                        stats
                            .filter((stat) => stat.total_amount !== 0)
                            .map((stat) =>
                                new Date(stat.month).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                })
                            )
                    )
                );

                setMonthlyStats(stats);
                setAvailableMonths(months);
                setSelectedMonth(months[0]);
                setError('');
            } catch (error) {
                console.error('Error fetching stats:', error);
                setError('Failed to load spending data');
            }
        };

        if (status === 'authenticated') {
            fetchStats();
        }
    }, [session?.user?.id, status]);

    const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMonth(event.target.value);
    };

    // Filter and transform data for the selected month
    const getBarData = () => {
        return monthlyStats
            .filter(
                (stat) =>
                    new Date(stat.month).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                    }) === selectedMonth
            )
            .map((stat) => ({
                name: stat.category_name,
                value: stat.total_amount,
            }));
    };

    const getTotalBudgetStatus = () => {
        const selectedMonthStats = monthlyStats.filter(
            (stat) =>
                new Date(stat.month).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                }) === selectedMonth
        );

        const totalSpent = selectedMonthStats.reduce((sum, stat) => sum + stat.total_amount, 0);
        const totalBudget = selectedMonthStats.reduce((sum, stat) => sum + (stat.budget || 0), 0);

        return {
            totalSpent,
            totalBudget,
            percentage: Math.round((totalSpent / totalBudget) * 100),
        };
    };

    if (status === 'loading') {
        return (
            <div className="flex justify-center items-center p-4">
                <p>Loading...</p>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return (
            <div className="flex justify-center items-center p-4">
                <p>Please sign in to view your spending chart</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center p-4 bg-red-200">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-red-200 relative">
            <h1 className="text-3xl text-center mb-8 font-semibold">Dashboard</h1>

            <div className="absolute top-4 right-4 max-w-72">
                {(() => {
                    const { totalSpent, totalBudget, percentage } = getTotalBudgetStatus();
                    if (percentage >= 80 && percentage <= 100) {
                        return (
                            <div className="w-full max-w-md mb-4 p-3 bg-red-100 border border-red-500 rounded-lg shadow-md">
                                <p className="text-red-800 font-medium">
                                    Notification: You have reached {percentage}% of your total
                                    budget this month. Please review your expenses to stay within
                                    your financial goals!
                                </p>
                            </div>
                        );
                    }
                    if (percentage > 100) {
                        return (
                            <div className="w-full max-w-md mb-4 p-3 bg-red-100 border-2 border-red-500 rounded-lg">
                                <p className="text-red-600">
                                    Warning: You have exceeded your total budget for this month.
                                    Spent: ${totalSpent.toFixed(2)} / Budget: $
                                    {totalBudget.toFixed(2)}
                                </p>
                            </div>
                        );
                    }
                    return null;
                })()}
            </div>

            {availableMonths.length > 0 ? (
                <>
                    <div className="text-lg font-semibold mb-1">Select your month</div>
                    <select
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        className="mb-6 p-2 min-w-56 bg-neutral-200 border-2 border-[#101010] rounded-md"
                    >
                        {availableMonths.map((month) => (
                            <option key={month} value={month}>
                                {month}
                            </option>
                        ))}
                    </select>

                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={getBarData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis color="#101010" dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#55d4fe" />
                        </BarChart>
                    </ResponsiveContainer>
                </>
            ) : (
                <p>No data available for any month</p>
            )}
        </div>
    );
};

export default SpendingChart;

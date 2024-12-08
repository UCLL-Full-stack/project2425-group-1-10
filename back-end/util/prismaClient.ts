import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient();

prismaClient.$extends({
    result: {
        category: {
            remaining: {
                needs: {
                    id: true,
                    budget: true,
                },
                async compute(params) {
                    const totalSpent = await prismaClient.expense.aggregate({
                        _sum: {
                            amount: true,
                        },
                        where: {
                            categoryId: params.id,
                        },
                    });

                    const spentAmount = totalSpent._sum.amount || 0;
                    return params.budget - spentAmount;
                },
            },

            spent: {
                needs: {
                    id: true,
                },
                async compute(params) {
                    const totalSpent = await prismaClient.expense.aggregate({
                        _sum: {
                            amount: true,
                        },
                        where: {
                            categoryId: params.id,
                        },
                    });

                    const spentAmount = totalSpent._sum.amount || 0;
                    return spentAmount;
                },
            },
        },
    },
});

export { prismaClient };

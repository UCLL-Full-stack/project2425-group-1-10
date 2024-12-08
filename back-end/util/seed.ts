import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

interface UserCredential {
    email: string;
    password: string;
}

const userCredentials: UserCredential[] = [];

const CATEGORY_TEMPLATES = [
    {
        name: 'Groceries',
        budgetRange: [400, 800],
        expenseTemplates: [
            'Weekly Grocery Shopping at Walmart',
            'Whole Foods Purchase',
            'Local Market Shopping',
            'Costco Bulk Shopping',
            'Fresh Produce Shopping',
        ],
    },
    {
        name: 'Rent',
        budgetRange: [1000, 2500],
        expenseTemplates: [
            'Monthly Rent Payment',
            'Rental Insurance',
            'Maintenance Fee',
            'Security Deposit',
        ],
    },
    {
        name: 'Utilities',
        budgetRange: [100, 300],
        expenseTemplates: [
            'Electricity Bill',
            'Water and Sewage',
            'Gas Bill',
            'Internet Service',
            'Phone Bill',
        ],
    },
    {
        name: 'Transportation',
        budgetRange: [200, 500],
        expenseTemplates: [
            'Gas Station Fill-up',
            'Monthly Transit Pass',
            'Car Service',
            'Parking Fee',
            'Uber Ride',
        ],
    },
    {
        name: 'Entertainment',
        budgetRange: [100, 400],
        expenseTemplates: [
            'Netflix Subscription',
            'Movie Theater Tickets',
            'Concert Tickets',
            'Spotify Premium',
            'PlayStation Plus',
        ],
    },
    {
        name: 'Healthcare',
        budgetRange: [200, 600],
        expenseTemplates: [
            'Doctor Visit Copay',
            'Pharmacy - Prescription',
            'Dental Cleaning',
            'Vision Check-up',
            'Health Insurance Premium',
        ],
    },
    {
        name: 'Shopping',
        budgetRange: [200, 700],
        expenseTemplates: [
            'Amazon Purchase',
            'Target Shopping',
            'Best Buy Electronics',
            'Home Depot Supplies',
            'Clothing Purchase',
        ],
    },
    {
        name: 'Dining Out',
        budgetRange: [200, 500],
        expenseTemplates: [
            'Restaurant Dinner',
            'Lunch Break',
            'Coffee Shop',
            'Food Delivery',
            'Fast Food',
        ],
    },
    {
        name: 'Travel',
        budgetRange: [300, 1000],
        expenseTemplates: [
            'Flight Tickets',
            'Hotel Booking',
            'Car Rental',
            'Travel Insurance',
            'Vacation Activities',
        ],
    },
    {
        name: 'Education',
        budgetRange: [200, 800],
        expenseTemplates: [
            'Online Course',
            'Textbooks',
            'School Supplies',
            'Tutorial Session',
            'Workshop Registration',
        ],
    },
];

// Utility functions
const getRandomRecentDate = (): Date => {
    const now = new Date();
    const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));
    return faker.date.between({ from: sixMonthsAgo, to: new Date() });
};

const getExpenseDescription = (categoryName: string): string => {
    const category = CATEGORY_TEMPLATES.find((cat) => cat.name === categoryName);
    if (!category) return faker.commerce.productName();

    const randomIndex = faker.number.int({ min: 0, max: category.expenseTemplates.length - 1 });
    return category.expenseTemplates[randomIndex];
};

async function main() {
    try {
        // Clean up existing data
        console.log('🧹 Starting database cleanup...');
        await prisma.expense.deleteMany({});
        await prisma.category.deleteMany({});
        await prisma.user.deleteMany({});
        console.log('✨ Database cleaned successfully');

        // Create users
        console.log('👤 Creating users...');
        const users = await Promise.all(
            Array(10)
                .fill(null)
                .map(async (_, index) => {
                    const firstName = faker.person.firstName();
                    const lastName = faker.person.lastName();
                    const email = faker.internet.email({ firstName, lastName }).toLowerCase();
                    const password = 'password123'; // Default password for all users

                    // Store credentials
                    userCredentials.push({
                        email,
                        password,
                    });

                    return prisma.user.create({
                        data: {
                            name: `${firstName} ${lastName}`,
                            email,
                            password: await bcrypt.hash(password, 10),
                        },
                    });
                })
        );
        console.log(`✅ Created ${users.length} users`);

        // Create categories for each user
        console.log('📑 Creating categories...');
        const allCategories = [];
        for (const user of users) {
            const userCategories = await Promise.all(
                CATEGORY_TEMPLATES.map((template) =>
                    prisma.category.create({
                        data: {
                            name: template.name,
                            budget: faker.number.int({
                                min: template.budgetRange[0],
                                max: template.budgetRange[1],
                            }),
                            userId: user.id,
                        },
                    })
                )
            );
            allCategories.push(...userCategories);
        }
        console.log('✅ Created categories for all users');

        // Create expenses
        console.log('💰 Creating expenses...');
        for (const category of allCategories) {
            const expensesCount = faker.number.int({ min: 30, max: 50 });
            const expenses = Array(expensesCount)
                .fill(null)
                .map(() => ({
                    description: getExpenseDescription(category.name),
                    amount: faker.number.float({
                        min: 5,
                        max: category.budget * 0.2,
                        fractionDigits: 2,
                    }),
                    date: getRandomRecentDate(),
                    userId: category.userId,
                    categoryId: category.id,
                }));

            await prisma.expense.createMany({ data: expenses });
        }
        console.log('✅ Created expenses for all categories');

        // Print summary
        const stats = {
            users: await prisma.user.count(),
            categories: await prisma.category.count(),
            expenses: await prisma.expense.count(),
        };

        console.log('\n📊 Seeding Summary:');
        console.log(`Users created: ${stats.users}`);
        console.log(`Categories created: ${stats.categories}`);
        console.log(`Expenses created: ${stats.expenses}`);

        // Print user credentials
        console.log('\n🔑 User Credentials for Testing:');
        userCredentials.forEach((cred, index) => {
            console.log(`\nUser ${index + 1}:`);
            console.log(`Email: ${cred.email}`);
            console.log(`Password: ${cred.password}`);
        });

        console.log('\n🎉 Seeding completed successfully!');
    } catch (error) {
        console.error('��� Seeding failed:', error);
        throw error;
    }
}

main()
    .catch((e) => {
        console.error('Failed to seed database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

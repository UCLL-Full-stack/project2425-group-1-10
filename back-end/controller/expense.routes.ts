import { Router } from 'express';
import { ExpenseService } from '../service/ExpenseService';

/**
 * @swagger
 * components:
 *   schemas:
 *     Expense:
 *       type: object
 *       required:
 *         - description
 *         - amount
 *         - categoryId
 *         - userId
 *       properties:
 *         description:
 *           type: string
 *           description: Description of the expense
 *         amount:
 *           type: number
 *           description: Amount of the expense
 *         categoryId:
 *           type: number
 *           description: ID of the expense category
 *         userId:
 *           type: number
 *           description: ID of the user who owns the expense
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date of the expense
 */

const expenseRouter = Router();
const expenseService = new ExpenseService();

/**
 * @swagger
 * /expenses:
 *   post:
 *     summary: Create a new expense
 *     tags: [Expenses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Expense'
 *     responses:
 *       201:
 *         description: Expense created successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
expenseRouter.post('/', async (req, res) => {
    const { description, amount, categoryId, userId, date } = req.body;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!description || !amount || !categoryId) {
        return res.status(400).json({ message: 'Invalid request' });
    }
    const result = await expenseService.createExpense({
        description,
        amount,
        categoryId,
        userId,
        date,
    });

    if (result.success) {
        return res.status(201).json(result);
    }
    return res.status(400).json(result);
});

/**
 * @swagger
 * /expenses/user/{userId}:
 *   get:
 *     summary: Get all expenses for a user
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: List of expenses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Expense'
 *       400:
 *         description: Error retrieving expenses
 *       401:
 *         description: Unauthorized
 */

expenseRouter.get('/user/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    const result = await expenseService.getExpenseByUserId({ userId });

    if (result.success) {
        return res.status(200).json(result.expenses);
    } else {
        return res.status(400).json({ message: result.message });
    }
});


/**
 * @swagger
 * /expenses/{id}:
 *   put:
 *     summary: Update an expense
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID of the expense to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Expense'
 *     responses:
 *       200:
 *         description: Expense updated successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
expenseRouter.put('/:id', async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const result = await expenseService.updateExpense({
        ...req.body,
        id: req.params.id,
        userId,
    });

    if (result.success) {
        return res.status(200).json(result);
    }
    return res.status(400).json(result);
});

/**
 * @swagger
 * /expenses/{id}:
 *   delete:
 *     summary: Delete an expense
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID of the expense to delete
 *     responses:
 *       200:
 *         description: Expense deleted successfully
 *       400:
 *         description: Invalid request
 */
expenseRouter.delete('/:id', async (req, res) => {
    const result = await expenseService.deleteExpense({
        id: Number(req.params.id),
    });

    if (result.success) {
        return res.status(200).json(result);
    }
    return res.status(400).json(result);
});

export { expenseRouter };

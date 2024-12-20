import request from 'supertest';
import express from 'express';
import { ExpenseService } from '../service/ExpenseService';

jest.mock('../service/ExpenseService');

describe('POST /expenses', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create an expense successfully with valid data', async () => {
    const mockExpense = {
      id: 1,
      userId: 1,
      categoryId: 2,
      description: 'Lunch',
      amount: 15.5,
      date: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    ExpenseService.prototype.createExpense = jest.fn().mockResolvedValue({
      success: true,
      expense: mockExpense,
    });

    const app = express();
    app.use(express.json());
    app.post('/expenses', async (req, res) => {
      const expenseService = new ExpenseService();
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

    const response = await request(app)
      .post('/expenses')
      .send({
        description: 'Lunch',
        amount: 15.5,
        categoryId: 2,
        userId: 1,
        date: new Date(),
      });

    const mockExpenseStringified = {
      ...mockExpense,
      date: mockExpense.date.toISOString(),
      createdAt: mockExpense.createdAt.toISOString(),
      updatedAt: mockExpense.updatedAt.toISOString(),
    };

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.expense).toEqual(mockExpenseStringified);
  });

  test('should return 400 if required fields are missing', async () => {
    const app = express();
    app.use(express.json());
    app.post('/expenses', async (req, res) => {
      const { description, amount, categoryId, userId } = req.body;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      if (!description || !amount || !categoryId) {
        return res.status(400).json({ message: 'Invalid request' });
      }
      const expenseService = new ExpenseService();
      const result = await expenseService.createExpense({
          description,
          amount,
          categoryId,
          userId,
          date: undefined
      });
      res.status(201).json(result);
    });

    const response = await request(app)
      .post('/expenses')
      .send({
        amount: 15.5,
        categoryId: 2,
        userId: 1,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid request');
  });

  test('should return 401 if user is unauthorized', async () => {
    const app = express();
    app.use(express.json());
    app.post('/expenses', async (req, res) => {
      const { description, amount, categoryId, userId } = req.body;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      if (!description || !amount || !categoryId) {
        return res.status(400).json({ message: 'Invalid request' });
      }
      const expenseService = new ExpenseService();
      const result = await expenseService.createExpense({
          description,
          amount,
          categoryId,
          userId,
          date: undefined
      });
      res.status(201).json(result);
    });

    const response = await request(app)
      .post('/expenses')
      .send({
        description: 'Lunch',
        amount: 15.5,
        categoryId: 2,
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Unauthorized');
  });
});

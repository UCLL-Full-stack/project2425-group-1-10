import request from 'supertest';
import express from 'express';
import { CategoryService } from '../service/CategoryService';

jest.mock('../service/CategoryService');

describe('POST /categories', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create a category successfully with valid data', async () => {
    const mockCategory = {
      id: 1,
      userId: 1,
      name: 'Food',
      budget: 200.0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    
    CategoryService.prototype.createCategory = jest.fn().mockResolvedValue({
      success: true,
      category: mockCategory,
    });

    const app = express();
    app.use(express.json());
    app.post('/categories', async (req, res) => {
      const { name, budget, userId } = req.body;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      if (!name || !budget) {
        return res.status(400).json({ message: 'Invalid request' });
      }
      const categoryService = new CategoryService();
      const result = await categoryService.createCategory({
        name,
        budget,
        userId,
      });
      if (result.success) {
        return res.status(201).json(result.category);
      }
      return res.status(400).json({ message: result.message });
    });

    const response = await request(app)
      .post('/categories')
      .send({
        name: 'Food',
        budget: 200.0,
        userId: 1,
      });

    const mockCategoryStringified = {
      ...mockCategory,
      createdAt: mockCategory.createdAt.toISOString(),
      updatedAt: mockCategory.updatedAt.toISOString(),
    };

    
    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockCategoryStringified);
  });

  test('should return 400 if required fields are missing', async () => {
    const app = express();
    app.use(express.json());
    app.post('/categories', async (req, res) => {
      const { name, budget, userId } = req.body;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      if (!name || !budget) {
        return res.status(400).json({ message: 'Invalid request' });
      }
      const categoryService = new CategoryService();
      const result = await categoryService.createCategory({
        name,
        budget,
        userId,
      });
      res.status(201).json(result);
    });

    const response = await request(app)
      .post('/categories')
      .send({
        budget: 200.0,
        userId: 1,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid request');
  });

  test('should return 401 if user is unauthorized', async () => {
    const app = express();
    app.use(express.json());
    app.post('/categories', async (req, res) => {
      const { name, budget, userId } = req.body;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      if (!name || !budget) {
        return res.status(400).json({ message: 'Invalid request' });
      }
      const categoryService = new CategoryService();
      const result = await categoryService.createCategory({
        name,
        budget,
        userId,
      });
      res.status(201).json(result);
    });

    const response = await request(app)
      .post('/categories')
      .send({
        name: 'Food',
        budget: 200.0,
        
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Unauthorized');
  });
});

describe('GET /categories', () => {
  test('should return a list of categories successfully for a user', async () => {
    const mockCategories = [
      { id: 1, userId: 1, name: 'Food', budget: 200.0 },
      { id: 2, userId: 1, name: 'Transport', budget: 100.0 },
    ];

    CategoryService.prototype.getCategoryByUserId = jest.fn().mockResolvedValue({
      success: true,
      categories: mockCategories,
    });

    const app = express();
    app.use(express.json());
    app.get('/categories', async (req, res) => {
      const { userId } = req.query;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const categoryService = new CategoryService();
      const result = await categoryService.getCategoryByUserId({ userId: Number(userId) });
      if (result.success) {
        return res.status(200).json(result.categories);
      }
      return res.status(400).json({ message: result.message });
    });

    const response = await request(app).get('/categories').query({ userId: 1 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockCategories);
  });

  test('should return 401 if userId is missing', async () => {
    const app = express();
    app.use(express.json());
    app.get('/categories', async (req, res) => {
      const { userId } = req.query;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const categoryService = new CategoryService();
      const result = await categoryService.getCategoryByUserId({ userId: Number(userId) });
      if (result.success) {
        return res.status(200).json(result.categories);
      }
      return res.status(400).json({ message: result.message });
    });

    const response = await request(app).get('/categories');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Unauthorized');
  });
});

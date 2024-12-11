import express, { Request, Response } from 'express';
import { CategoryService } from '../service/CategoryService';

const categoryRouter = express.Router();
const categoryService = new CategoryService();

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - name
 *               - budget
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID of the user creating the category
 *               name:
 *                 type: string
 *                 description: Name of the category
 *               budget:
 *                 type: number
 *                 description: Budget amount for the category
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
categoryRouter.post('/', async (req: Request, res: Response) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const { name, budget } = req.body;
    if (!name || !budget) {
        return res.status(400).json({ message: 'Invalid request' });
    }

    const result = await categoryService.createCategory({
        name,
        budget,
        userId,
    });
    if (result.success) {
        res.status(201).json(result.category);
    } else {
        res.status(400).json({ message: result.message });
    }
});

/**
 * @swagger
 * /categories/user/{userId}:
 *   get:
 *     summary: Get all categories for a user
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: List of categories
 *       400:
 *         description: Error retrieving categories
 */
categoryRouter.get('/user/:userId', async (req: Request, res: Response) => {
    const result = await categoryService.getCategoryByUserId({
        userId: parseInt(req.params.userId),
    });
    if (result.success) {
        res.status(200).json(result.categories);
    } else {
        res.status(400).json({ message: result.message });
    }
});

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               budget:
 *                 type: number
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Error updating category
 */
categoryRouter.put('/:id', async (req: Request, res: Response) => {
    const result = await categoryService.updateCategory({
        id: parseInt(req.params.id),
        ...req.body,
    });
    if (result.success) {
        res.status(200).json({ id: result.categoryId });
    } else {
        res.status(400).json({ message: result.message });
    }
});

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       400:
 *         description: Error deleting category
 */
categoryRouter.delete('/:id', async (req: Request, res: Response) => {
    const result = await categoryService.deleteCategory({
        id: parseInt(req.params.id),
    });
    if (result.success) {
        res.status(200).json({ id: result.categoryId });
    } else {
        res.status(400).json({ message: result.message });
    }
});

/**
 * @swagger
 * /categories/statistics/{userId}:
 *   get:
 *     summary: Get monthly statistics for categories
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: Monthly category statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statistics:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       categoryId:
 *                         type: integer
 *                       spent:
 *                         type: number
 *                       budget:
 *                         type: number
 *       400:
 *         description: Error retrieving statistics
 */
categoryRouter.get('/statistics/:userId', async (req: Request, res: Response) => {
    const result = await categoryService.getMonthlyCategoryStatistics({
        userId: parseInt(req.params.userId),
    });
    if (result.success) {
        res.status(200).json(result.statistics);
    } else {
        res.status(400).json({ message: result.message });
    }
});

export default categoryRouter;

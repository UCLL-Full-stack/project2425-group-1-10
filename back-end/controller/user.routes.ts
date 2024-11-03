import express, { Request, Response } from 'express';
import { UserService } from '../service/UserService';

const userRouter = express.Router();
const userService = new UserService();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: User ID.
 *         username:
 *           type: string
 *           description: Username of the user.
 *         email:
 *           type: string
 *           description: Email of the user.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: User creation date.
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: password123
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   description: The ID of the created user
 *       400:
 *         description: Invalid input
 */
userRouter.post('/register', async (req: Request, res: Response) => {
    const { username, password, email } = req.body;

    const result = await userService.registerUser({ username, password, email });
    if (result.success) {
        res.status(201).json(result.user);
    } else {
        res.status(400).json({ message: result.message });
    }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
// userRouter.get('/:id', async (req: Request, res: Response) => {
//     const { id } = req.params;

//     const user = await userService.getUserById(id);
//     if (user) {
//         res.status(200).json(user);
//     } else {
//         res.status(404).json({ message: 'User not found' });
//     }
// });

export { userRouter };

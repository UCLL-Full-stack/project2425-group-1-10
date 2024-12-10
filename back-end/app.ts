import * as bodyParser from 'body-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import categoryRouter from './controller/category.routes';
import { expenseRouter } from './controller/expense.routes';
import { userRouter } from './controller/user.routes';

dotenv.config();

const app = express();
const port = process.env.APP_PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'User Management API',
            version: '1.0.0',
            description: 'API Documentation for managing users',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
            },
        ],
    },
    apis: ['./controller/*.routes.ts'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/status', (req, res) => {
    res.json({ message: 'Back-end is running...' });
});

app.use('/users', userRouter);
app.use('/categories', categoryRouter);
app.use('/expenses', expenseRouter);

app.listen(port, () => {
    console.log(`Back-end is running on port http://localhost:${port}.`);
});

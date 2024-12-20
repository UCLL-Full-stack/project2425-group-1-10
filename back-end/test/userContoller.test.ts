import request from 'supertest';
import express from 'express';
import { UserService } from '../service/UserService';

jest.mock('../service/UserService');

describe('POST /register', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });


test('should register a user successfully with valid data', async () => {
    const mockUser = {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'USER',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  
    UserService.prototype.registerUser = jest.fn().mockResolvedValue({
      success: true,
      user: mockUser,
    });
  
    const app = express();
    app.use(express.json());
    app.post('/register', async (req, res) => {
      const userService = new UserService();
      const result = await userService.registerUser(req.body);
      if (result.success) {
        res.status(201).json({ message: 'User successfully registered', user: result.user });
      } else {
        res.status(400).json({ message: result.message });
      }
    });
  
    const response = await request(app)
      .post('/register')
      .send({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'securepassword',
      });
  
    const mockUserStringified = {
      ...mockUser,
      createdAt: mockUser.createdAt.toISOString(),
      updatedAt: mockUser.updatedAt.toISOString(),
    };
  
    // Compare the response with the mockUser after stringifying the date fields
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User successfully registered');
    expect(response.body.user).toEqual(mockUserStringified);
  });
  

  test('should return 400 if required fields are missing', async () => {
    const app = express();
    app.use(express.json());
    app.post('/register', async (req, res) => {
      if (!req.body.name || !req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'Name, email, and password are required.' });
      }
      const userService = new UserService();
      const result = await userService.registerUser(req.body);
      res.status(201).json(result);
    });

    const response = await request(app)
      .post('/register')
      .send({
        email: 'john.doe@example.com',
        password: 'securepassword'
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Name, email, and password are required.');
  });

  test('should return 400 if email is already in use', async () => {
    UserService.prototype.registerUser = jest.fn().mockResolvedValue({
      success: false,
      message: 'Email is already in use'
    });

    const app = express();
    app.use(express.json());
    app.post('/register', async (req, res) => {
      const userService = new UserService();
      const result = await userService.registerUser(req.body);
      if (result.success) {
        res.status(201).json({ message: 'User successfully registered', user: result.user });
      } else {
        res.status(400).json({ message: result.message });
      }
    });

    const response = await request(app)
      .post('/register')
      .send({
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        password: 'securepassword'
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email is already in use');
  });
});

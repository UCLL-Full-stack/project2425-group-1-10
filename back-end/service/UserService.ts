import userDB from '../repository/user.db';
import { IUser } from '../model/User';
import { CreateUserDTO, LoginUserDTO } from '../dtos/User';
import bcrypt from 'bcrypt';

export class UserService {
    async loginUser(
        data: LoginUserDTO
    ): Promise<{ success: boolean; message?: string; user?: IUser }> {
        try {
            const user = await userDB.getUserByEmail(data.email);
            if (!user) {
                return { success: false, message: 'User not found' };
            }
            if (await bcrypt.compare(data.password, user.password)) {
                return { success: true, user };
            } else {
                return { success: false, message: 'Invalid email or password' };
            }
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Failed to login' };
        }
    }
    async registerUser(
        data: CreateUserDTO
    ): Promise<{ success: boolean; message?: string; user?: IUser }> {
        try {
            if (!data.email || !data.password || !data.name) {
                return { success: false, message: 'Invalid user data' };
            }
            const existingUser = await userDB.getUserByEmail(data.email);
            if (existingUser) {
                return { success: false, message: 'Email is already in use' };
            }
            const hashedPassword = await bcrypt.hash(data.password, 10);
            const userData = { ...data, password: hashedPassword };
            const user = await userDB.createUser(userData);
            return { success: true, user };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Failed to register user' };
        }
    }

    async getUserById(id: string): Promise<{ success: boolean; message?: string; user?: IUser }> {
        try {
            const user = await userDB.getUserById(id);
            if (user) {
                return { success: true, user };
            } else {
                return { success: false, message: 'User not found' };
            }
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Failed to retrieve user' };
        }
    }
    async getAllUsers(): Promise<{ success: boolean; message?: string; users?: IUser[] }> {
        try {
            const users = await userDB.getAllUsers();
            return { success: true, users };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Failed to retrieve users' };
        }
    }
}

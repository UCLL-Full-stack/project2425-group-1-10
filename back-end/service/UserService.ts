import userDB from '../repository/user.db';
import { IUser } from '../model/User';

export class UserService {
    async registerUser(userData: { username: string; password: string; email: string }): Promise<{ success: boolean; message?: string; user?: IUser }> {
        const { username, password, email } = userData;

        try {
            
            const existingUser = await userDB.getAllUsers();
            if (existingUser.some(user => user.email === email)) {
                return { success: false, message: "Email is already in use" };
            }

            
            const newUser = { username, password, email } as IUser;
            const savedUser = await userDB.createUser(newUser);
            return { success: true, user: savedUser };
        } catch (error) {
            console.error(error);
            return { success: false, message: "Failed to create user" };
        }
    }

    async getUserById(id: string): Promise<{ success: boolean; message?: string; user?: IUser }> {
        try {
            const user = await userDB.getUserById(id);
            if (user) {
                return { success: true, user };
            } else {
                return { success: false, message: "User not found" };
            }
        } catch (error) {
            console.error(error);
            return { success: false, message: "Failed to retrieve user" };
        }
    }

    async getAllUsers(): Promise<{ success: boolean; users?: IUser[]; message?: string }> {
        try {
            const users = await userDB.getAllUsers();
            return { success: true, users };
        } catch (error) {
            console.error(error);
            return { success: false, message: "Failed to retrieve users" };
        }
    }
}

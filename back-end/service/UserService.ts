import userDB from '../repository/user.db';
import { User, User as UserModel } from '../model/User'; 

export class UserService {
    async registerUser(userData: { username: string; password: string; email: string }): Promise<{ success: boolean; message?: string; user?: User }> {
        const { username, password, email } = userData;

        try {
            
            const existingUsers = await userDB.getAllUsers();
            if (existingUsers.some(user => user.getEmail() === email)) {
                return { success: false, message: "Email is already in use" };
            }

            
            const newUser = new User({ username, password, email });
            const savedUser = await userDB.createUser(newUser.toPlainObject()); 
            return { success: true, user: savedUser };
        } catch (error) {
            console.error("Error in registerUser:", error);
            return { success: false, message: "Failed to create user" };
        }
    }

    async getUserById(id: number): Promise<{ success: boolean; message?: string; user?: UserModel }> {
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

    async getAllUsers(): Promise<{ success: boolean; users?: UserModel[]; message?: string }> {
        try {
            const users = await userDB.getAllUsers(); 
            return { success: true, users };
        } catch (error) {
            console.error(error);
            return { success: false, message: "Failed to retrieve users" };
        }
    }
}

import { User } from '../model/User'; 
import { User as UserModel } from '../model/User'; 

const users: UserModel[] = []; 

const createUser = async (userData: { username: string; password: string; email: string }): Promise<UserModel> => {
    try {
        const newUser = new User(userData); 
        users.push(newUser); 
        return newUser; 
    } catch (error) {
        console.error("Error in createUser:", error);
        throw new Error('Error: cannot create the user');
    }
};

const getAllUsers = async (): Promise<UserModel[]> => {
    try {
        return users; 
    } catch (error) {
        console.error("Error in getAllUsers:", error);
        throw new Error('Error: cannot getall users');
    }
};

const getUserById = async (id: number): Promise<UserModel | null> => {
    try {
        return users.find(user => user.getId() === id) || null; 
    } catch (error) {
        console.error("Error in getUserById:", error);
        throw new Error('Error: cannot get user by id');
    }
};

export default { createUser, getAllUsers, getUserById };

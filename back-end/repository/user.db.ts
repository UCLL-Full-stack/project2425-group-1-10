import { User, IUser } from '../model/User';


const createUser = async (userData: IUser): Promise<IUser> => {
    try {
        const newUser = new User(userData);
        return await newUser.save();
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};


const getAllUsers = async (): Promise<IUser[]> => {
    try {
        return await User.find();
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getUserById = async (id: string): Promise<IUser | null> => {
    try {
        return await User.findById(id) || null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export default { createUser, getAllUsers, getUserById };

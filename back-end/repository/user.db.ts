import { prismaClient } from '../util/prismaClient';
import { IUser } from '../model/User';
import { CreateUserDTO } from '../dtos/User';

const createUser = async (userData: CreateUserDTO): Promise<IUser> => {
    try {
        const user = await prismaClient.user.create({
            data: userData,
        });
        return user;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getUserByEmail = async (email: string): Promise<IUser | null> => {
    try {
        return await prismaClient.user.findUnique({ where: { email } });
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getUserById = async (id: string): Promise<IUser | null> => {
    try {
        return await prismaClient.user.findUnique({
            where: { id: parseInt(id) },
        });
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getAllUsers = async (): Promise<IUser[]> => {
    try {
        return await prismaClient.user.findMany();
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export default { createUser, getUserByEmail, getUserById, getAllUsers };

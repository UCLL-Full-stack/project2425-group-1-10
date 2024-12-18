import { axios } from 'lib/axios';
import { User } from '../types';
import { signIn } from 'next-auth/react';
import { AxiosError } from 'axios';

export const createAccount = async (
    user: Omit<User, 'id'>
): Promise<{ success: boolean; error?: string }> => {
    try {
        await axios.post(`/users/register`, {
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role,
        });
        return { success: true };
    } catch (error) {
        if (error instanceof AxiosError) {
            return { success: false, error: error.response?.data.message };
        }
        return { success: false, error: 'Something went wrong' };
    }
};

type LoginDTO = {
    email: string;
    password: string;
};
type LoginResponseDTO = {
    success: boolean;
    error?: string;
};

export const loginUser = async (data: LoginDTO): Promise<LoginResponseDTO | undefined> => {
    try {
        const response = await signIn('Credentials', {
            email: data.email,
            password: data.password,
            redirect: false,
        });
        if (response?.ok) {
            return { success: true };
        }
        return {
            success: false,
            error:
                response?.status === 401 ? 'Invalid username or password' : 'Something went wrong',
        };
    } catch (error) {
        return { success: false, error: 'Invalid username or password' };
    }
};

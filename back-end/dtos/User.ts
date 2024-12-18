import { Role } from "@prisma/client";

interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
    role: Role; 
}

interface LoginUserDTO {
    email: string;
    password: string;
}

export { CreateUserDTO, LoginUserDTO };

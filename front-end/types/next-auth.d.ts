import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            role: string;
            accessToken: string;
        } & DefaultSession['user'];
    }

    interface User {
        id: string;
        email: string;
        name: string;
        role: string;
    }

    interface JWT {
        id: string;
        email: string;
        name: string;
        role: string;
        accessToken: string;
    }
}

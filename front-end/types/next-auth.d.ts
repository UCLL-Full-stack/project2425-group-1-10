// types/next-auth.d.ts
import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            accessToken: string;
        } & DefaultSession['user'];
    }

    interface User {
        id: string;
        email: string;
        name: string;
    }

    interface JWT {
        id: string;
        email: string;
        name: string;
        accessToken: string;
    }
}

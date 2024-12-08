import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextApiHandler } from 'next';
import { axios } from 'lib/axios';

const authHandler: NextApiHandler = (req, res) =>
    NextAuth(req, res, {
        providers: [
            CredentialsProvider({
                name: 'Credentials',
                credentials: {
                    email: { label: 'Email', type: 'email' },
                    password: { label: 'Password', type: 'password' },
                },
                async authorize(credentials) {
                    if (!credentials?.email || !credentials?.password) {
                        return null;
                    }
                    try {
                        const response = await axios.post('/users/login', {
                            email: credentials?.email,
                            password: credentials?.password,
                        });
                        console.log(response.data);
                        if (response.data && response.data.id) {
                            return {
                                id: response.data.id,
                                name: response.data.name,
                                email: response.data.email,
                            };
                        }
                        return null;
                    } catch (error) {
                        console.error(error);
                        return null;
                    }
                },
            }),
        ],
        callbacks: {
            async jwt({ token, user }) {
                if (user) {
                    token.email = user.email;
                    token.id = user.id;
                    token.name = user.name;
                }
                return token;
            },
            async session({ session, token }) {
                if (token.id) {
                    session.user.id = token.id as string;
                }

                return session;
            },
        },
        secret: process.env.JWT_SECRET,
        pages: {
            signIn: '/login',
        },
    });

export default authHandler;

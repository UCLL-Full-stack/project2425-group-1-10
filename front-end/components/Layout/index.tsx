import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import clsx from 'clsx';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { data: session } = useSession();
    const handleLogout = () => {
        signOut({ callbackUrl: '/login' });
    };
    const router = useRouter();
    return (
        <div className="overflow-hidden ">
            <header
                className={clsx('sticky h-20 top-0 w-full  z-10 ', {
                    'bg-red-200': router.pathname === '/',
                })}
            >
                <div className="max-w-screen-xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link href="/">
                        <div className="text-xl font-bold text-gray-900">Budget buddy</div>
                    </Link>

                    <div className="flex items-center space-x-6">
                        <Link
                            href="/spending"
                            className="px-4 py-2 text-gray-900 font-semibold  rounded-md hover:text-red-900 focus:outline-none"
                        >
                            Spending
                        </Link>
                        <Link
                            href="/dashboard"
                            className="px-4 py-2 text-gray-900 font-semibold  rounded-md hover:text-red-900 focus:outline-none"
                        >
                            Dashboard
                        </Link>
                        {session ? (
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-red-600  rounded-md focus:outline-none"
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={() => router.push('/login')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </header>
            <main className="h-[calc(100vh-80px)] overflow-y-auto">{children}</main>
        </div>
    );
};

export default Layout;

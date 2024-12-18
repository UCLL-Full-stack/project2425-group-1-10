import React from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {

    const { t } = useTranslation('common');
    const router = useRouter();
    const { pathname, asPath, query, locale } = router;

    const { data: session } = useSession();
    const handleLogout = () => {
        signOut({ callbackUrl: '/login' });
    };

    const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedLocale = e.target.value;
        router.push({ pathname, query }, asPath, { locale: selectedLocale });
    };

    return (
        <div className="overflow-hidden ">
            <header
                className={clsx('sticky h-20 top-0 w-full  z-10 shadow-xl', {
                    'bg-red-200': router.pathname === '/',
                })}
            >
                <div className="max-w-screen-xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link href="/">
                        <div className="text-xl font-bold text-gray-900">Budget buddy</div>
                    </Link>

                    <div className="flex items-center space-x-6">
                        <select onChange={changeLanguage} defaultValue={router.locale}>
                            <option value="en">English</option>
                            <option value="nl">Dutch</option>
                        </select>

                        <Link
                            href="/spending"
                            className="px-4 py-2 text-gray-900 font-semibold  rounded-md hover:text-red-900 focus:outline-none"
                        >
                            {t('common:head_one')}
                        </Link>
                        <Link
                            href="/dashboard"
                            className="px-4 py-2 text-gray-900 font-semibold  rounded-md hover:text-red-900 focus:outline-none"
                        >
                            {t('common:head_two')}
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
                                {t('common:head_login')}
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

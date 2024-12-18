import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import SpendingChart from '@components/dashboard/SpendingChart';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (!session) {
        const locale = context.locale;
        const basePath = locale ? `/${locale}` : '';

        return {
            redirect: {
                destination: `${basePath}/login`,
                permanent: false,
            },
        };
    }

    return {
        props: {
            session,
            ...(await serverSideTranslations(context.locale as string, ['common'])),
        },
    };
};

const BudgetDashboard = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <SpendingChart />
        </div>
    );
};

export default BudgetDashboard;

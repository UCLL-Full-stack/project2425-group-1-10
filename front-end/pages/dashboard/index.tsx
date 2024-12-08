import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import SpendingChart from '@components/dashboard/SpendingChart';

const BudgetDashboard = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <SpendingChart />
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    return {
        props: {
            session,
        },
    };
};

export default BudgetDashboard;

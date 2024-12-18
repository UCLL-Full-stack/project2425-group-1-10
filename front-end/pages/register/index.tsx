import React from 'react';
import CreateAccount from '../../components/register/createAccount';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale as string, ['common', 'home', 'index', 'login'])),
        },
    };
};

const RegisterPage: React.FC = () => {
    return (
        <div>
            <CreateAccount />
        </div>
    );
};

export default RegisterPage;

import LoginForm from '@components/LoginForm';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';


export const getStaticProps: GetStaticProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale as string, ['index', 'common', 'login', 'home'])),
        },
    };
};
const LoginPage: React.FC = () => {

    return (
        <div>
            <LoginForm />
        </div>
    );
};

export default LoginPage;

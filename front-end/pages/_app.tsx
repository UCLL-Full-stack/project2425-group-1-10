import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import {appWithTranslation} from 'next-i18next';
import '../styles/globals.css';
import Layout from '@components/Layout';

const MyApp = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
    return (
        <SessionProvider session={session}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </SessionProvider>
    );
};

export default appWithTranslation(MyApp);

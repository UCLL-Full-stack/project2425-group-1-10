import React, { useState, useEffect } from 'react'; 
import { FaQuoteLeft } from 'react-icons/fa';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale as string, ['index', 'common', 'login', 'home']))
        },
    };
};

const HomePage: React.FC = () => {

    const { t } = useTranslation('index');
    const { locale } = useRouter();

    const [quote, setQuote] = useState<{ text: string; author: string }>({
        text: '',
        author: '',
    });
    const router = useRouter();

    useEffect(() => {

        const savingsQuotes = [
            { text: t('quote_one'), author: 'Benjamin Franklin' },
            { text: t('quote_two'), author: 'Warren Buffett' },
            { text: t('quote_three'), author: 'Morgan Housel' },
            { text: t('quote_four'), author: 'T.T. Munger' },
            { text: t('quote_five'), author: 'Ayoub' },
            { text: t('quote_six'), author: 'Nasser' },
        ];

        const randomQuote = savingsQuotes[Math.floor(Math.random() * savingsQuotes.length)];
        setQuote(randomQuote);
    }, [locale]);

    const handleRedirect = () => {
        router.push('/dashboard');
    };

    return (
        <div className="relative overflow-hidden flex items-center flex-col justify-center h-full text-gray-800" key={locale}>
            {/* Background Image */}
            <div className="absolute inset-0 -z-10">
                <Image
                    src="/background.png"
                    alt="Background"
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                />
            </div>

            <div className="absolute inset-0 bg-red-500 opacity-30 -z-10" />

            <div className="bg-white bg-opacity-80 shadow-lg rounded-md flex flex-col items-center justify-center p-8 min-w-[600px] max-w-lg text-center mb-6">
                <FaQuoteLeft className="text-green-500 text-3xl mb-4" />
                <p className="text-xl italic text-gray-600 mb-4">{quote.text}</p>
                <p className="text-lg font-semibold text-gray-500 mb-6">– {quote.author}</p>
                <button
                    onClick={handleRedirect}
                    className="bg-green-500 text-white px-6 py-3 rounded-lg shadow hover:bg-green-600 transition mb-6"
                >
                    {t('index:dashboard_button')}
                </button>

                {/* Tabel met gebruikersgegevens */}
                <div className="mt-6">
                    <h2 className="text-lg font-bold mb-4">{t('index:testing_credentials')}</h2>
                    <table className="table-auto border-collapse border border-gray-300 w-full text-left text-sm">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">{t('index:username')}</th>
                                <th className="border border-gray-300 px-4 py-2">{t('index:password')}</th>
                                <th className="border border-gray-300 px-4 py-2">{t('index:email')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2">user1</td>
                                <td className="border border-gray-300 px-4 py-2">user12345</td>
                                <td className="border border-gray-300 px-4 py-2">user1@gmail.com</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2">guest1</td>
                                <td className="border border-gray-300 px-4 py-2">guest12345</td>
                                <td className="border border-gray-300 px-4 py-2">guest1@gmail.com</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2">admin1</td>
                                <td className="border border-gray-300 px-4 py-2">admin12345</td>
                                <td className="border border-gray-300 px-4 py-2">admin1@gmail.com</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default HomePage;

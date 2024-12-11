import React, { useState, useEffect } from 'react';
import { FaQuoteLeft } from 'react-icons/fa';
import { useRouter } from 'next/router';
import Image from 'next/image';

const savingsQuotes = [
    {
        text: 'Do not save what is left after spending, but spend what is left after saving.',
        author: 'Warren Buffett',
    },
    { text: 'A penny saved is a penny earned.', author: 'Benjamin Franklin' },
    {
        text: 'Saving is the gap between your ego and your income.',
        author: 'Morgan Housel',
    },
    {
        text: 'The habit of saving is itself an education; it fosters every virtue, teaches self-denial, cultivates the sense of order, and trains to forethought.',
        author: 'T.T. Munger',
    },
    { text: 'Saving today ensures a brighter tomorrow.', author: 'Ayoub' },
    { text: 'Financial freedom begins with savings.', author: 'Nasser' },
];

const HomePage: React.FC = () => {
    const [quote, setQuote] = useState<{ text: string; author: string }>({
        text: '',
        author: '',
    });
    const router = useRouter();

    useEffect(() => {
        const randomQuote = savingsQuotes[Math.floor(Math.random() * savingsQuotes.length)];
        setQuote(randomQuote);
    }, []);

    const handleRedirect = () => {
        router.push('/dashboard');
    };

    return (
        <div className="relative overflow-hidden flex items-center flex-col justify-center h-full text-gray-800">
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
                    className="bg-green-500 text-white px-6 py-3 rounded-lg shadow hover:bg-green-600 transition"
                >
                    Go to Dashboard
                </button>
            </div>
        </div>
    );
};

export default HomePage;

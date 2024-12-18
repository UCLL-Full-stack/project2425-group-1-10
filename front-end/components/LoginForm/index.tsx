import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

const LoginForm: React.FC = () => {

    const {t} = useTranslation('login');

    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState<{ email?: string; password?: string }>({});
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
        setError((prevError) => ({ ...prevError, [name]: '' }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        
        const newError: { email?: string; password?: string } = {};
        if (!credentials.email) newError.email = 'Email is required';
        if (!credentials.password) newError.password = 'Password is required';

        setError(newError);

        
        if (Object.keys(newError).length > 0) return;

        const result = await signIn('credentials', {
            email: credentials.email,
            password: credentials.password,
            redirect: false,
        });

        if (result?.error) {
            setError({ password: 'Invalid email or password' });
        } else {
            router.push('/dashboard'); 
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#f0f0f0',
                padding: '20px',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '30px',
                    border: '2px solid black',
                    maxWidth: '600px',
                    width: '100%',
                    backgroundColor: '#f8eaea',
                    borderRadius: '8px',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                }}
            >
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
                    {t('login:login_title')}
                </h2>
                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <div style={{ marginBottom: '16px' }}>
                        <label
                            style={{
                                fontWeight: 'bold',
                                display: 'block',
                                marginBottom: '5px',
                                width: '100%',
                            }}
                        >
                            {t('login:login_email')}
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={credentials.email}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '2px solid black',
                                borderRadius: '4px',
                            }}
                        />
                        {error.email && (
                            <div style={{ color: 'black', marginTop: '5px' }}>{error.email}</div>
                        )}
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label
                            style={{
                                fontWeight: 'bold',
                                display: 'block',
                                marginBottom: '5px',
                                width: '100%',
                            }}
                        >
                            {t('login:login_password')}
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '2px solid black',
                                borderRadius: '4px',
                            }}
                        />
                        {error.password && (
                            <div style={{ color: 'black', marginTop: '5px' }}>{error.password}</div>
                        )}
                    </div>

                    <button
                        type="submit"
                        style={{
                            padding: '12px',
                            backgroundColor: '#cccccc',
                            border: '2px solid black',
                            cursor: 'pointer',
                            width: '100%',
                            fontWeight: 'bold',
                            borderRadius: '4px',
                        }}
                    >
                        {t('login:login_title')}
                    </button>
                </form>
                <div className="text-center mt-4">
                    {t('login:login_description')}
                    <Link className="text-blue-500" href="/register">
                        {t('login:login_register')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;

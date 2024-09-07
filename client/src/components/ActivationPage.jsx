import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function ActivationPage() {
    const { activationcode } = useParams();
    const [message, setMessage] = useState('');

    useEffect(() => {
        const activateAccount = async () => {
            try {
                const response = await axios.post(`http://localhost:5173/api/auth/confirm/${activationcode}`);
                setMessage(response.data.message);
            } catch (error) {
                setMessage('Erreur lors de l’activation du compte.');
            }
        };

        activateAccount();
    }, [activationcode]);

    return (
        <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
            <div className='bg-white p-8 rounded-lg shadow-lg max-w-md w-full'>
                <h1 className='text-3xl font-bold mb-4 text-center'>Bienvenue</h1>
                <p className='text-lg mb-4 text-center'>{message}</p>
                <a href='/sign-in' className='block text-center text-blue-600 hover:underline'>Se Connecter</a>
            </div>
        </div>
    );
}

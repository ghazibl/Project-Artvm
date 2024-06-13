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
        <div>
            <h1>Activation</h1>
            <p>{message}</p>
        </div>
    );
}

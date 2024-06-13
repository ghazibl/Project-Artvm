import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Dropdown } from 'flowbite-react';
import { IoNotificationsOutline } from 'react-icons/io5';
import sound from '../assets/SOUND.wav';
import NotificationBadge from "react-notification-badge/lib/components/NotificationBadge";
import { Effect } from "react-notification-badge";

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [newNotification, setNewNotification] = useState(false);
    const [currentUser, setCurrentUser] = useState({ isAdmin: false });
    const [readNotifications, setReadNotifications] = useState([]); // État pour suivre les notifications lues

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.userId) {
            setCurrentUser(user);
            console.log("currentUser", user);
            console.log("userName", user.username);
        }
    }, []);

    useEffect(() => {
        const socket = io('http://localhost:3000');

        socket.on('connect', () => {
            console.log('Connected to socket server');
        });

        const handleNotification = (data) => {
            setNotifications((prevNotifications) => [...prevNotifications, { ...data, type: data.type, read: false }]);
            setNewNotification(true);
            playNotificationSound();
        };

        const playNotificationSound = () => {
            const audio = new Audio(sound);
            audio.play();
        };

        if (currentUser.isAdmin) {
            socket.on('commandeCreated', (data) => handleNotification({ ...data, type: 'commande' }));
            socket.on('DevisCreated', (data) => handleNotification({ ...data, type: 'devis' }));
            socket.on('eventNotification', (data) => handleNotification({ ...data, type: 'event' }));
            socket.on('SignUpNotification', (data) => handleNotification({ ...data, type: 'SingUp' }));
        } else {
            socket.on('commandeConfirmée', (data) => handleNotification({ ...data, type: 'commande' }));
            socket.on('DevisUpdated', (data) => handleNotification({ ...data, type: 'devis' }));
            socket.on('FactureCreated', (data) => handleNotification({ ...data, type: 'facture' }));
        }

        return () => {
            socket.disconnect();
            if (currentUser.isAdmin) {
                socket.off('commandeCreated');
                socket.off('DevisCreated');
                socket.off('eventNotification');
                socket.off('SignUpNotification');
            } else {
                socket.off('commandeConfirmée');
                socket.off('DevisUpdated');
                socket.off('FactureCreated');
            }
        };
    }, [currentUser]);

    const markAsRead = (index) => {
        setNotifications((prevNotifications) =>
            prevNotifications.map((notification, i) =>
                i === index ? { ...notification, read: true } : notification
            )
        );
    };

    const unreadNotificationsCount = notifications.filter(notification => !notification.read).length;

    const getNotificationMessage = (notification, currentUser) => {
        switch (notification.type) {
            case 'commande':
                return currentUser.isAdmin
                    ? `${notification.username} a envoyé une nouvelle commande.`
                    : 'Votre commande a été confirmée.';
            case 'devis':
                return currentUser.isAdmin
                    ? `  ${notification.username} a demandé un nouveau devis.`
                    : 'Votre devis a été Crée.';
            case 'facture':
                return !currentUser.isAdmin
                    ? `Votre facture a été crée.`
                    : '';
            case 'event':
                return currentUser.isAdmin
                    ? `L'événement ${notification.title} commence maintenant.`
                    : '';
            case 'SingUp':
                return currentUser.isAdmin
                    ? `${notification.username} a créé un compte.`
                    : '';
            default:
                return '';
        }
    };

    return (
        <Dropdown
            arrowIcon={false}
            inline
            label={
                <div>
                    <NotificationBadge count={unreadNotificationsCount} effect={Effect.SCALE} />
                    <IoNotificationsOutline className='text-black text-3xl' />
                </div>
            }
        >
            <Dropdown.Header>
                <span className='text-blue-700 text-base'>Notifications</span>
            </Dropdown.Header>
            {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                    <Dropdown.Item key={index} onClick={() => markAsRead(index)}>
                        {currentUser.isAdmin && notification.profilePicture && (
                            <img
                                src={notification.profilePicture}
                                alt='Profile'
                                style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }}
                            />
                        )}
                        <span style={{ fontWeight: notification.read ? 'normal' : 'bold' }}>
                            {getNotificationMessage(notification, currentUser)}
                        </span>
                    </Dropdown.Item>
                ))
            ) : (
                <Dropdown.Item>Aucune notification</Dropdown.Item>
            )}
        </Dropdown>
    );
};

export default Notification;

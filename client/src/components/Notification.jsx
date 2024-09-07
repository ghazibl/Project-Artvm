import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Dropdown } from 'flowbite-react';
import { IoNotificationsOutline } from 'react-icons/io5';
import sound from '../assets/SOUND.wav';
import NotificationBadge from 'react-notification-badge/lib/components/NotificationBadge';
import { Effect } from 'react-notification-badge';
import axios from 'axios';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState(false);
  const [currentUser, setCurrentUser] = useState({ isAdmin: false });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const notificationsPerPage = 8;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.userId) {
      setCurrentUser(user);
      fetchNotifications(user.userId, user.isAdmin);
    }
  }, []);

  const fetchNotifications = async (userId, isAdmin) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/notifications/user/${userId}`, {
        params: { isAdmin },
      });
      const sortedNotifications = response.data.notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setNotifications(sortedNotifications);
      setTotalNotifications(response.data.total);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };
  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    const handleNotification = (data) => {
      const isRelevant =
        currentUser.isAdmin ? data.target === 'admin' : data.UserId === currentUser.userId && data.target === 'user';
      if (isRelevant) {
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          { ...data, type: data.type, read: false },
        ]);
        setNewNotification(true);
        playNotificationSound();
      }
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

  const unreadNotificationsCount = notifications.filter((notification) => !notification.read).length;

  const getNotificationMessage = (notification, currentUser) => {
    const { data } = notification;
    switch (notification.event) {
      case 'commandeCreated':
        return currentUser.isAdmin
          ? `${data.username} a envoyé une nouvelle commande.`
          : 'Votre commande a été confirmée.';
      case 'DevisCreated':
        return currentUser.isAdmin
          ? `${data.username} a demandé un nouveau devis.`
          : 'Votre devis a été créé.';
      case 'commandeConfirmée':
        return 'Votre commande a été confirmée.';
      case 'FactureCreated':
        return 'Votre facture a été créée.';
      default:
        return '';
    }
  };

  const handleNextPage = () => {
    if (currentPage * notificationsPerPage < totalNotifications) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  // Calculate the notifications to display on the current page
  const startIndex = (currentPage - 1) * notificationsPerPage;
  const endIndex = startIndex + notificationsPerPage;
  const currentNotifications = notifications.slice(startIndex, endIndex);

  return (
    <Dropdown
      arrowIcon={false}
      inline
      label={
        <div className="relative">
          <NotificationBadge count={unreadNotificationsCount} effect={Effect.SCALE} />
          <IoNotificationsOutline className="text-black text-3xl" />
        </div>
      }
    >
      <Dropdown.Header>
        <span className="text-blue-700 text-base">Notifications</span>
      </Dropdown.Header>
      {currentNotifications.length > 0 ? (
        currentNotifications.map((notification, index) => (
          <Dropdown.Item
            key={index}
            onClick={() => markAsRead(index + startIndex)}
            className="flex items-center space-x-4 p-3 hover:bg-gray-100"
          >
            {currentUser.isAdmin && notification.data.profilePicture && (
              <img
                src={notification.data.profilePicture}
                alt="Profile"
                style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }}
              />
            )}
            <div>
              <span
                className={`block text-sm ${notification.read ? 'font-normal' : 'font-bold'}`}
              >
                {getNotificationMessage(notification, currentUser)}
              </span>
              {currentUser.isAdmin && (
              <span className="block text-xs text-gray-500">
                {new Date(notification.timestamp).toLocaleString()}
              </span>
              )}
            </div>
          </Dropdown.Item>
        ))
      ) : (
        <Dropdown.Item className="text-center text-gray-500">Aucune notification</Dropdown.Item>
      )}
      <Dropdown.Divider />
      <div className="flex justify-between px-4 py-2">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-2 py-1 ${currentPage === 1 ? 'text-gray-400' : 'text-blue-600'} cursor-pointer`}
        >
          Précédent
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage * notificationsPerPage >= totalNotifications}
          className={`px-2 py-1 ${currentPage * notificationsPerPage >= totalNotifications ? 'text-gray-400' : 'text-blue-600'} cursor-pointer`}
        >
          Suivant
        </button>
      </div>
    </Dropdown>
  );
};

export default Notification;

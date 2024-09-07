import express from 'express';
import Notification from '../models/NotificationModel.js';

const router = express.Router();

// Fetch all notifications
router.get('/', async (req, res) => {
  const { page = 1, limit = 8 } = req.query;

  try {
    const notifications = await Notification.find()
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments();

    res.status(200).json({
      notifications,
      total,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const { isAdmin } = req.query;

  try {
    // Définir le filtre en fonction du statut d'administrateur
    const filter = isAdmin === 'true' 
      ? { 'data.target': 'admin' } 
      : {  'data.target': 'user' };

    console.log('Filter Applied:', filter);

    // Récupérer les notifications correspondant au filtre
    const notifications = await Notification.find(filter);
    console.log('Notifications Fetched:', notifications);

    // Compter le nombre total de notifications correspondant au filtre
    const total = await Notification.countDocuments(filter);

    // Répondre avec les notifications et le total
    res.status(200).json({
      notifications,
      total,
    });
  } catch (error) {
    // Gérer les erreurs
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});


router.patch('/:id', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });

    notification.read = true;
    await notification.save();

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

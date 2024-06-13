import { Server } from 'socket.io';
import Notification from '../models/NotificationModel.js';

class NotificationService {
  constructor(io) {
    this.io = io;

    this.io.on('connection', (socket) => {
      console.log('New client connected');
      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
  }

  async emit(event, data) {
    this.io.emit(event, data);
    try {
      const notification = new Notification({ event, data });
      await notification.save();
      console.log('Notification saved to database');
    } catch (err) {
      console.error('Error saving notification to database', err);
    }
  }
}

export default NotificationService;

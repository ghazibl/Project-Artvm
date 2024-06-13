import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  event: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model('Notification', NotificationSchema);

export default Notification;

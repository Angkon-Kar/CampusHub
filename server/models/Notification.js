// server/models/Notification.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['approved', 'declined', 'feedback', 'reported', 'review_approved', 'review_declined'], required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    title: { type: String, default: '', maxlength: 150 },
    message: { type: String, required: true, maxlength: 300 },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, read: 1 });
// Old notifications clean themselves up after 60 days
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 24 * 60 * 60 });

export const Notification = mongoose.model('Notification', notificationSchema);
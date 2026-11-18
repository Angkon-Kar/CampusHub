// server/utils/notify.js
import { Notification } from '../models/Notification.js';

// A failed notification must never break the action that caused it (review, report...)
export const notifyUser = async ({ user, type, post, title = '', message }) => {
  try {
    await Notification.create({
      user,
      type,
      post,
      title: String(title).slice(0, 150),
      message: String(message).slice(0, 300),
    });
  } catch (error) {
    console.error('Notification failed:', error.message);
  }
};
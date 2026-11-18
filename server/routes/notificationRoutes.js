// server/routes/notificationRoutes.js
import express from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Notification } from '../models/Notification.js';
import { verifyFirebaseToken } from '../middlewares/authMiddleware.js';
import { sendServerError } from '../utils/httpError.js';

const router = express.Router();

// GET /api/notifications -> latest 30 + unread count (own notifications only)
router.get('/', verifyFirebaseToken, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.firebaseUser.uid }).select('_id').lean();
    if (!user) return res.status(404).json({ message: 'User profile not found!' });

    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ user: user._id }).sort({ createdAt: -1 }).limit(30).lean(),
      Notification.countDocuments({ user: user._id, read: false }),
    ]);

    res.status(200).json({ success: true, notifications, unreadCount });
  } catch (error) {
    sendServerError(res, error);
  }
});

// POST /api/notifications/read -> mark one ({ id }) or all notifications as read
router.post('/read', verifyFirebaseToken, async (req, res) => {
  const { id } = req.body || {};
  if (id && !mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid notification id!' });

  try {
    const user = await User.findOne({ firebaseUid: req.firebaseUser.uid }).select('_id').lean();
    if (!user) return res.status(404).json({ message: 'User profile not found!' });

    const filter = { user: user._id, read: false, ...(id && { _id: id }) };
    await Notification.updateMany(filter, { $set: { read: true } });
    res.status(200).json({ success: true });
  } catch (error) {
    sendServerError(res, error);
  }
});

export default router;
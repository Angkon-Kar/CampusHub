// server/routes/pushRoutes.js
import express from 'express';
import { PushSubscription } from '../models/PushSubscription.js';
import { User } from '../models/User.js';
import { verifyFirebaseToken } from '../middlewares/authMiddleware.js';
import { sendPushToUser, isPushConfigured } from '../utils/pushService.js';

const router = express.Router();
const MAX_DEVICES_PER_USER = 10;

// 1. Public VAPID key (the browser needs it to subscribe). null = push is not configured yet.
router.get('/public-key', (req, res) => {
  res.status(200).json({
    success: true,
    publicKey: isPushConfigured() ? process.env.VAPID_PUBLIC_KEY : null,
  });
});

// 2. Save this device's subscription for the signed-in user
router.post('/subscribe', verifyFirebaseToken, async (req, res) => {
  const { endpoint, keys } = req.body?.subscription || {};
  const { uid } = req.firebaseUser;

  if (typeof endpoint !== 'string' || !endpoint.startsWith('https://') || !keys?.p256dh || !keys?.auth) {
    return res.status(400).json({ message: 'Invalid push subscription!' });
  }

  try {
    const user = await User.findOne({ firebaseUid: uid }).select('_id');
    if (!user) return res.status(404).json({ message: 'User profile not found!' });

    // Upsert by endpoint: the same phone signing in with another account moves to that account
    await PushSubscription.findOneAndUpdate(
      { endpoint },
      {
        user: user._id,
        keys: { p256dh: String(keys.p256dh), auth: String(keys.auth) },
        userAgent: String(req.headers['user-agent'] || '').slice(0, 300),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Keep only the newest devices per user
    const devices = await PushSubscription.find({ user: user._id }).sort({ createdAt: -1 }).select('_id');
    if (devices.length > MAX_DEVICES_PER_USER) {
      await PushSubscription.deleteMany({ _id: { $in: devices.slice(MAX_DEVICES_PER_USER).map(({ _id }) => _id) } });
    }

    res.status(200).json({ success: true, message: 'Notifications enabled on this device.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. Remove this device
router.post('/unsubscribe', verifyFirebaseToken, async (req, res) => {
  const { endpoint } = req.body || {};
  const { uid } = req.firebaseUser;
  if (typeof endpoint !== 'string') return res.status(400).json({ message: 'Endpoint is required!' });

  try {
    const user = await User.findOne({ firebaseUid: uid }).select('_id');
    if (user) await PushSubscription.deleteOne({ endpoint, user: user._id });
    res.status(200).json({ success: true, message: 'Notifications turned off on this device.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. "Send me a test notification" button
router.post('/test', verifyFirebaseToken, async (req, res) => {
  const { uid } = req.firebaseUser;

  try {
    const user = await User.findOne({ firebaseUid: uid }).select('_id username');
    if (!user) return res.status(404).json({ message: 'User profile not found!' });

    await sendPushToUser(user._id, {
      title: 'Campus Hub notifications are on 🎉',
      body: 'You will get a message here when a post is approved or declined.',
      url: `/${user.username}`,
      tag: 'push-test',
    });
    res.status(200).json({ success: true, message: 'Test notification sent.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

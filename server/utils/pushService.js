// server/utils/pushService.js
import webpush from 'web-push';
import { PushSubscription } from '../models/PushSubscription.js';

let configured = false;

const configure = () => {
  if (configured) return true;
  const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT = 'mailto:admin@example.com' } = process.env;
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) return false;

  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  configured = true;
  return true;
};

export const isPushConfigured = () => configure();

const clip = (text = '', max = 160) => (text.length > max ? `${text.slice(0, max - 1)}…` : text);

// Sends a notification to every device of one user. Never throws: a failed push must not break the request.
// Later, a new comment can call this too:
//   sendPushToUser(post.author, { title: 'New comment', body: '...', url: `/post/${post._id}` })
export const sendPushToUser = async (userId, { title, body, url = '/', tag }) => {
  if (!configure()) return;

  try {
    const subscriptions = await PushSubscription.find({ user: userId }).lean();
    const payload = JSON.stringify({ title: clip(title, 80), body: clip(body), url, tag });

    await Promise.all(
      subscriptions.map(async ({ _id, endpoint, keys }) => {
        try {
          await webpush.sendNotification({ endpoint, keys }, payload, { TTL: 60 * 60 * 24 });
        } catch (error) {
          // 404/410 = the phone removed the permission or uninstalled: forget this subscription
          if (error.statusCode === 404 || error.statusCode === 410) {
            await PushSubscription.deleteOne({ _id });
          } else {
            console.warn(`Push failed (${error.statusCode || 'network'}): ${error.message}`);
          }
        }
      })
    );
  } catch (error) {
    console.warn(`Push error: ${error.message}`);
  }
};

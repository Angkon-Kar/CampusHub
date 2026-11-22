// server/utils/dailyLimit.js
import { Post } from '../models/Post.js';

const DAY_MS = 24 * 60 * 60 * 1000;
const STAFF_ROLES = ['admin', 'moderator'];

// Set DAILY_POST_LIMIT in .env to change it (default 5 posts per rolling 24 hours)
export const getDailyLimit = () => Number(process.env.DAILY_POST_LIMIT) || 5;

// Rolling 24-hour window (no timezone problems). Declined posts count too, otherwise spam would be free.
export const getDailyUsage = async (user) => {
  if (STAFF_ROLES.includes(user.role)) return { unlimited: true };

  const limit = getDailyLimit();
  const since = new Date(Date.now() - DAY_MS);
  const recent = await Post.find({ author: user._id, createdAt: { $gte: since } })
    .sort({ createdAt: 1 })
    .select('createdAt')
    .lean();

  const used = recent.length;
  // A slot frees up 24h after the post that is "in the way"
  const resetsAt = used >= limit ? new Date(recent[used - limit].createdAt.getTime() + DAY_MS) : null;

  return { unlimited: false, limit, used, remaining: Math.max(0, limit - used), resetsAt };
};

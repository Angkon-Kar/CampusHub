// server/utils/views.js
import crypto from 'node:crypto';
import { Post } from '../models/Post.js';
import { PostView } from '../models/PostView.js';

// Signed-in people are counted by account. Guests get a one-way code made from IP + browser,
// which is only kept for the 30 minute window (the row is deleted automatically).
export const viewerKeyFor = (req, userId) => {
  if (userId) return `u:${userId}`;
  const raw = `${req.ip}|${req.get('user-agent') || ''}`;
  const code = crypto
    .createHash('sha256')
    .update(`${process.env.VIEW_SALT || 'campushub-views'}|${raw}`)
    .digest('hex')
    .slice(0, 32);
  return `g:${code}`;
};

// Adds one view unless this viewer already counted in the last 30 minutes.
// `post` is an approved post document with at least { _id, views }.
export const registerView = async (post, viewerKey) => {
  try {
    await PostView.create({ post: post._id, viewer: viewerKey });
  } catch (error) {
    if (error.code === 11000) return { counted: false, views: post.views }; // already counted recently
    throw error;
  }

  const updated = await Post.findOneAndUpdate(
    { _id: post._id, status: 'approved' },
    { $inc: { views: 1 } },
    { new: true }
  ).select('views');

  return { counted: Boolean(updated), views: updated?.views ?? post.views };
};
// server/models/PostView.js
// One short-lived row per (post, viewer). While the row exists, that viewer's visits do not add more views.
// MongoDB deletes the row by itself after VIEW_WINDOW_SECONDS, so the next visit counts again.
import mongoose from 'mongoose';

export const VIEW_WINDOW_SECONDS = 30 * 60; // one view per person per post every 30 minutes

const postViewSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  // "u:<userId>" for signed-in people, "g:<hash>" for guests
  viewer: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: VIEW_WINDOW_SECONDS },
});

postViewSchema.index({ post: 1, viewer: 1 }, { unique: true });

export const PostView = mongoose.model('PostView', postViewSchema);
// server/models/Post.js
import mongoose from 'mongoose';

export const POST_TYPES = ['resource', 'article', 'course', 'project'];
export const FONTS = ['Inter', 'Merriweather', 'Fira Code'];

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: POST_TYPES, required: true },
    title: { type: String, required: true, trim: true, maxlength: 150 },
    content: { type: String, default: '', maxlength: 60000 },
    fontFamily: { type: String, enum: FONTS, default: 'Inter' },
    externalLink: { type: String, required: true },
    unmaskedLink: { type: String, required: true },
    aiSafetyNote: { type: String, default: 'Verified Clean' },
    // Optional Credit & Source Info (User na janle General thakbe)
    college: { type: String, default: 'General', trim: true },
    department: { type: String, default: 'General', trim: true },
    session: { type: String, default: 'General', trim: true },
    resourceCredit: { type: String, default: '', trim: true, maxlength: 120 },
    tags: {
      type: [{ type: String, lowercase: true, trim: true }],
      validate: { validator: (arr) => arr.length <= 8, message: 'Maximum 8 tags allowed.' },
    },
    status: { type: String, enum: ['pending', 'approved', 'declined', 'reported'], default: 'pending' },
    adminComment: { type: String, default: '' },
    views: { type: Number, default: 0 },
    lovedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    viewedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // one view per signed-in user
    reports: [
      {
        reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        reason: { type: String, required: true, maxlength: 300 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

postSchema.index({ college: 1, department: 1, session: 1, status: 1 });
postSchema.index({ status: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ author: 1, status: 1 });
postSchema.index({ title: 'text', tags: 'text' });

export const Post = mongoose.model('Post', postSchema);
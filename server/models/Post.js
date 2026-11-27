// server/models/Post.js
import mongoose from 'mongoose';

export const POST_TYPES = ['resource', 'article', 'course', 'project'];
export const POST_STATUSES = ['pending', 'approved', 'declined', 'reported'];
export const FONTS = ['Inter', 'Hind Siliguri', 'Fira Code', 'Merriweather'];

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: POST_TYPES, required: true },
    title: { type: String, required: true, trim: true, maxlength: 150 },
    slug: { type: String, unique: true, sparse: true, trim: true, lowercase: true },
    content: { type: String, default: '', maxlength: 60000 },
    fontFamily: { type: String, enum: FONTS, default: 'Inter' },
    externalLink: { type: String, required: true },
    unmaskedLink: { type: String, required: true },
    // Normalised link used for duplicate detection (see utils/linkKey.js)
    linkKey: { type: String, default: '' },
    aiSafetyNote: { type: String, default: 'Verified Clean' },
    // Optional Credit & Source Info (User na janle General thakbe)
    college: { type: String, default: 'General', trim: true },
    department: { type: String, default: 'General', trim: true },
    session: { type: String, default: 'General', trim: true },
    resourceCredit: { type: String, default: '', trim: true, maxlength: 120 },
    // Notes & slides only: where the material sits in the syllabus (checked against data/syllabusIndex.js)
    semester: { type: Number, min: 1, max: 8, default: null },
    subjectCode: { type: String, default: '', trim: true, maxlength: 30 },
    subjectName: { type: String, default: '', trim: true, maxlength: 150 },
    tags: {
      type: [{ type: String, lowercase: true, trim: true }],
      validate: { validator: (arr) => arr.length <= 8, message: 'Maximum 8 tags allowed.' },
    },
    status: { type: String, enum: POST_STATUSES, default: 'pending' },
    adminComment: { type: String, default: '' },
    views: { type: Number, default: 0 },
    lovedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    viewedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // one view per signed-in user
    reports: [
      {
        reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        reason: { type: String, default: 'Broken or expired link' },
        reportedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Indexes for fast filtering & search (supports 100k+ posts smoothly)
postSchema.index({ status: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ author: 1, status: 1 });
postSchema.index({ department: 1, semester: 1, subjectCode: 1, status: 1 }); // subject filters
postSchema.index({ author: 1, createdAt: -1 }); // daily upload limit
postSchema.index({ linkKey: 1, status: 1 }); // duplicate link check
postSchema.index({ title: 'text', tags: 'text' });

export const Post = mongoose.model('Post', postSchema);
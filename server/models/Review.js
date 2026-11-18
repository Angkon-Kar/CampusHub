// server/models/Review.js
import mongoose from 'mongoose';

export const REVIEW_STATUSES = ['pending', 'approved', 'declined'];

const reviewSchema = new mongoose.Schema(
  {
    // One review per person: sending again edits it (and sends it back to the moderators)
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true, trim: true, minlength: 10, maxlength: 600 },
    status: { type: String, enum: REVIEW_STATUSES, default: 'pending' },
    adminComment: { type: String, default: '', maxlength: 500 },
    // true = the reviewer's email address was verified when they wrote the review
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

reviewSchema.index({ status: 1, createdAt: -1 });
reviewSchema.index({ status: 1, rating: 1 });

export const Review = mongoose.model('Review', reviewSchema);
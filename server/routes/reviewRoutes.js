// server/routes/reviewRoutes.js
import express from 'express';
import admin from '../config/firebaseAdmin.js';
import { Review } from '../models/Review.js';
import { Post } from '../models/Post.js';
import { User } from '../models/User.js';
import { verifyFirebaseToken, optionalFirebaseToken, requireVerifiedEmail } from '../middlewares/authMiddleware.js';
import { sendServerError } from '../utils/httpError.js';

const router = express.Router();

const USER_FIELDS = 'fullName username college department avatarColor avatarUrl';
const SORTS = {
  newest: { createdAt: -1 },
  highest: { rating: -1, createdAt: -1 },
  lowest: { rating: 1, createdAt: -1 },
};

// Average + how many reviews gave 1..5 stars (approved reviews only)
const getSummary = async () => {
  const rows = await Review.aggregate([
    { $match: { status: 'approved' } },
    { $group: { _id: '$rating', count: { $sum: 1 } } },
  ]);

  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  rows.forEach(({ _id, count }) => {
    distribution[_id] = count;
  });

  const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
  const weighted = Object.entries(distribution).reduce((sum, [stars, count]) => sum + Number(stars) * count, 0);
  const average = total ? Math.round((weighted / total) * 10) / 10 : 0;

  return { average, total, distribution };
};

// Live check: the ID token can be up to an hour old
const isEmailVerified = async ({ uid, email_verified: emailVerified }) => {
  if (emailVerified === true) return true;
  try {
    return (await admin.auth().getUser(uid)).emailVerified;
  } catch {
    return false;
  }
};

// 1. Public list (GET /api/reviews?page=1&rating=5&sort=newest). A token is optional: it adds "myReview".
router.get('/', optionalFirebaseToken, async (req, res) => {
  const { rating, sort: rawSort, page = '1', limit = '12' } = req.query;
  const sort = SORTS[rawSort] ? rawSort : 'newest';

  try {
    const filter = { status: 'approved' };
    const stars = parseInt(rating, 10);
    if (stars >= 1 && stars <= 5) filter.rating = stars;

    const safePage = Math.max(1, parseInt(page, 10) || 1);
    const safeLimit = Math.min(30, Math.max(1, parseInt(limit, 10) || 12));

    const viewer = req.firebaseUser
      ? await User.findOne({ firebaseUid: req.firebaseUser.uid }).select('_id').lean()
      : null;

    const [reviews, filteredTotal, summary, myReview] = await Promise.all([
      Review.find(filter)
        .select('rating text verified createdAt user')
        .populate('user', USER_FIELDS)
        .sort(SORTS[sort])
        .skip((safePage - 1) * safeLimit)
        .limit(safeLimit)
        .lean(),
      Review.countDocuments(filter),
      getSummary(),
      viewer ? Review.findOne({ user: viewer._id }).lean() : null,
    ]);

    // "Contributor" = has at least one approved post
    const authorIds = reviews.map(({ user }) => user?._id).filter(Boolean);
    const contributorRows = authorIds.length
      ? await Post.aggregate([
          { $match: { status: 'approved', author: { $in: authorIds } } },
          { $group: { _id: '$author' } },
        ])
      : [];
    const contributors = new Set(contributorRows.map(({ _id }) => _id.toString()));

    res.status(200).json({
      success: true,
      reviews: reviews
        .filter(({ user }) => Boolean(user))
        .map((review) => ({ ...review, contributor: contributors.has(review.user._id.toString()) })),
      summary,
      total: filteredTotal,
      page: safePage,
      hasMore: safePage * safeLimit < filteredTotal,
      myReview: myReview
        ? {
            _id: myReview._id,
            rating: myReview.rating,
            text: myReview.text,
            status: myReview.status,
            adminComment: myReview.adminComment,
            updatedAt: myReview.updatedAt,
          }
        : null,
    });
  } catch (error) {
    sendServerError(res, error);
  }
});

// 2. Write or edit my review (POST /api/reviews). It always goes to the moderators first.
router.post('/', verifyFirebaseToken, requireVerifiedEmail, async (req, res) => {
  const rating = Number(req.body?.rating);
  // Plain text only: remove control characters and squeeze huge gaps
  const text = String(req.body?.text ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Please choose a rating from 1 to 5 stars.' });
  }
  if (text.length < 10) return res.status(400).json({ message: 'Please write at least 10 characters.' });
  if (text.length > 600) return res.status(400).json({ message: 'Your review is too long (max 600 characters).' });

  try {
    const user = await User.findOne({ firebaseUid: req.firebaseUser.uid }).select('_id').lean();
    if (!user) return res.status(404).json({ message: 'User profile not found!' });

    const verified = await isEmailVerified(req.firebaseUser);

    const review = await Review.findOneAndUpdate(
      { user: user._id },
      { $set: { rating, text, status: 'pending', adminComment: '', verified } },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Thank you! Your review was sent to the moderators. It appears here once approved.',
      myReview: {
        _id: review._id,
        rating: review.rating,
        text: review.text,
        status: review.status,
        adminComment: review.adminComment,
        updatedAt: review.updatedAt,
      },
    });
  } catch (error) {
    sendServerError(res, error);
  }
});

// 3. Delete my review
router.delete('/mine', verifyFirebaseToken, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.firebaseUser.uid }).select('_id').lean();
    if (!user) return res.status(404).json({ message: 'User profile not found!' });

    await Review.deleteOne({ user: user._id });
    res.status(200).json({ success: true, message: 'Your review was deleted.' });
  } catch (error) {
    sendServerError(res, error);
  }
});

export default router;
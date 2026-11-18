// server/routes/adminRoutes.js
import express from 'express';
import mongoose from 'mongoose';
import { Post } from '../models/Post.js';
import { User } from '../models/User.js';
import { Review } from '../models/Review.js';
import { verifyFirebaseToken } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';
import { inspectLink, linkErrorResponse } from '../middlewares/linkValidator.js';
import { sendServerError } from '../utils/httpError.js';
import { notifyUser } from '../utils/notify.js';

const router = express.Router();

const escapeRegex = (text) => String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const QUEUE_STATUSES = ['pending', 'reported', 'declined', 'approved'];
const DAYS_BY_TIMEFRAME = { weekly: 7, monthly: 30, yearly: 365 };

// College + search filter shared by the analytics and the moderation queue
const buildPostMatch = (college, search) => {
  const match = {};
  if (college && college !== 'All') match.college = String(college);

  const cleanSearch = String(search || '').trim().slice(0, 50);
  if (cleanSearch) {
    const pattern = new RegExp(escapeRegex(cleanSearch), 'i');
    match.$or = [{ title: pattern }, { department: pattern }, { college: pattern }];
  }
  return match;
};

// Dates are grouped in the admin's own timezone (the browser sends it). Bad values fall back to UTC.
const safeTimezone = (tz) => {
  try {
    new Intl.DateTimeFormat('en', { timeZone: String(tz) });
    return String(tz);
  } catch {
    return 'UTC';
  }
};

// Tell the author what happened to their post (in-app notification)
const notifyAuthor = async (post, previousStatus, previousComment) => {
  const note = post.adminComment ? ` Moderator note: ${post.adminComment}` : '';
  const base = { user: post.author, post: post._id, title: post.title };

  if (post.status === 'approved' && previousStatus !== 'approved') {
    return notifyUser({ ...base, type: 'approved', message: `Your post was approved and is now live.${note}` });
  }
  if (post.status === 'declined' && previousStatus !== 'declined') {
    return notifyUser({ ...base, type: 'declined', message: `Your post was declined.${note}` });
  }
  if (post.status === 'pending' && post.adminComment && post.adminComment !== previousComment) {
    return notifyUser({ ...base, type: 'feedback', message: `A moderator left feedback.${note}` });
  }
  return undefined;
};

// ১. Analytics (GET /api/admin/analytics?timeframe=monthly&college=All&search=&tz=Asia/Dhaka)
// Everything is calculated inside MongoDB: no posts are sent to the browser here.
router.get('/analytics', verifyFirebaseToken, requireRole(['admin', 'moderator']), async (req, res) => {
  const { timeframe = 'monthly', college = 'All', search = '', tz = 'UTC' } = req.query;

  try {
    const days = DAYS_BY_TIMEFRAME[timeframe] || 30;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const timezone = safeTimezone(tz);
    const dateFormat = timeframe === 'yearly' ? '%Y-%m' : '%Y-%m-%d';

    const periodMatch = { createdAt: { $gte: startDate } };
    const countIf = (status) => ({ $sum: { $cond: [{ $eq: ['$status', status] }, 1, 0] } });
    const userFilter = college && college !== 'All' ? { college: String(college) } : {};

    const [[facets], activeMembersCount, staffMembers, pendingReviews] = await Promise.all([
      Post.aggregate([
        { $match: buildPostMatch(college, search) },
        { $addFields: { loveCount: { $size: { $ifNull: ['$lovedBy', []] } } } },
        {
          $facet: {
            period: [
              { $match: periodMatch },
              {
                $group: {
                  _id: null,
                  totalPosts: { $sum: 1 },
                  approvedCount: countIf('approved'),
                  declinedCount: countIf('declined'),
                  pendingCount: countIf('pending'),
                  reportedCount: countIf('reported'),
                  totalViews: { $sum: '$views' },
                  totalLoves: { $sum: '$loveCount' },
                },
              },
            ],
            byType: [{ $match: periodMatch }, { $group: { _id: '$type', count: { $sum: 1 } } }],
            queue: [{ $group: { _id: '$status', count: { $sum: 1 } } }],
            colleges: [
              {
                $group: {
                  _id: '$college',
                  posts: { $sum: 1 },
                  views: { $sum: '$views' },
                  loves: { $sum: '$loveCount' },
                },
              },
            ],
            contributors: [
              {
                $group: {
                  _id: '$author',
                  totalUploads: { $sum: 1 },
                  approvedUploads: countIf('approved'),
                  totalViews: { $sum: '$views' },
                  totalLoves: { $sum: '$loveCount' },
                },
              },
              { $sort: { approvedUploads: -1, totalLoves: -1 } },
              { $limit: 10 },
              { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
              { $unwind: '$user' },
              {
                $project: {
                  _id: { $toString: '$_id' },
                  fullName: '$user.fullName',
                  username: '$user.username',
                  college: '$user.college',
                  department: '$user.department',
                  totalUploads: 1,
                  approvedUploads: 1,
                  totalViews: 1,
                  totalLoves: 1,
                },
              },
            ],
            timeline: [
              { $match: periodMatch },
              {
                $group: {
                  _id: { $dateToString: { format: dateFormat, date: '$createdAt', timezone } },
                  uploads: { $sum: 1 },
                  approved: countIf('approved'),
                  declined: countIf('declined'),
                },
              },
            ],
          },
        },
      ]),
      User.countDocuments(userFilter),
      User.find({ ...userFilter, role: { $in: ['admin', 'moderator'] } })
        .select('fullName username email college role')
        .lean(),
      Review.countDocuments({ status: 'pending' }),
    ]);

    const [period = {}] = facets.period;
    const { _id: ignoredId, ...periodCounts } = period;

    const summaryMetrics = {
      totalPosts: 0,
      approvedCount: 0,
      declinedCount: 0,
      pendingCount: 0,
      reportedCount: 0,
      totalViews: 0,
      totalLoves: 0,
      ...periodCounts,
      byType: facets.byType.reduce((acc, { _id, count }) => ({ ...acc, [_id]: count }), {
        resource: 0,
        article: 0,
        course: 0,
        project: 0,
      }),
    };

    // All-time numbers for the moderation badges (they do not depend on the timeframe)
    const queueCounts = facets.queue.reduce(
      (acc, { _id, count }) => ({ ...acc, [_id]: count, all: acc.all + count }),
      { pending: 0, reported: 0, declined: 0, approved: 0, all: 0 }
    );

    res.status(200).json({
      success: true,
      timeframe,
      activeMembersCount,
      pendingReviews,
      summaryMetrics,
      queueCounts,
      timeline: facets.timeline.map(({ _id, uploads, approved, declined }) => ({
        key: _id,
        uploads,
        approved,
        declined,
      })),
      collegeBreakdown: facets.colleges.map(({ _id, posts, views, loves }) => ({ college: _id, posts, views, loves })),
      topContributors: facets.contributors,
      staffMembers,
    });
  } catch (error) {
    sendServerError(res, error);
  }
});

// ২. Moderation queue, one page at a time (GET /api/admin/posts?status=pending&page=1)
router.get('/posts', verifyFirebaseToken, requireRole(['admin', 'moderator']), async (req, res) => {
  const { status = 'pending', college = 'All', search = '', page = '1', limit = '15' } = req.query;

  try {
    const match = buildPostMatch(college, search);
    if (QUEUE_STATUSES.includes(status)) match.status = status; // "all" = no status filter

    const safePage = Math.max(1, parseInt(page, 10) || 1);
    const safeLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 15));
    const skip = (safePage - 1) * safeLimit;

    const [posts, total] = await Promise.all([
      Post.find(match)
        .select('-viewedBy')
        .populate('author', 'fullName username college department role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .lean(),
      Post.countDocuments(match),
    ]);

    res.status(200).json({
      success: true,
      posts: posts.map(({ lovedBy = [], ...rest }) => ({ ...rest, likesCount: lovedBy.length })),
      total,
      page: safePage,
      hasMore: skip + posts.length < total,
    });
  } catch (error) {
    sendServerError(res, error);
  }
});

// ৩. Review Post: Approve / Decline / Add Comment (PATCH /api/admin/posts/:id/review)
router.patch('/posts/:id/review', verifyFirebaseToken, requireRole(['admin', 'moderator']), async (req, res) => {
  const { id } = req.params;
  const { status, adminComment = '', updatedLink = '' } = req.body;

  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid post id!' });

  if (!['approved', 'declined', 'pending'].includes(status)) {
    return res.status(400).json({ message: 'Invalid moderation status!' });
  }

  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found!' });

    const previousStatus = post.status;
    const previousComment = post.adminComment || '';

    post.status = status;
    post.adminComment = String(adminComment).trim().slice(0, 500);

    // If a moderator fixes a reported link, it goes through the same checks as a student's upload
    if (String(updatedLink).trim()) {
      try {
        const meta = await inspectLink(String(updatedLink).trim(), { title: post.title, type: post.type });
        post.externalLink = meta.originalLink;
        post.unmaskedLink = meta.unmaskedLink;
        post.aiSafetyNote = meta.aiSafetyNote;
      } catch (linkError) {
        const { status: code, body } = linkErrorResponse(linkError);
        return res.status(code).json(body);
      }
    }

    // Approving again clears the old reports
    if (status === 'approved') post.reports = [];

    await post.save();
    await notifyAuthor(post, previousStatus, previousComment);

    res.status(200).json({
      success: true,
      message: `Post marked as ${status.toUpperCase()}!`,
      post,
    });
  } catch (error) {
    sendServerError(res, error);
  }
});

// ৪. Permanently Delete Malicious or Expired Post (DELETE /api/admin/posts/:id)
router.delete('/posts/:id', verifyFirebaseToken, requireRole(['admin', 'moderator']), async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid post id!' });
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Post not found!' });
    res.status(200).json({ success: true, message: 'Post permanently deleted!' });
  } catch (error) {
    sendServerError(res, error);
  }
});

// ৫. Reviews: list, approve/decline, delete (the public Reviews page only shows approved ones)
router.get('/reviews', verifyFirebaseToken, requireRole(['admin', 'moderator']), async (req, res) => {
  const { status = 'pending', page = '1', limit = '15' } = req.query;

  try {
    const filter = ['pending', 'approved', 'declined'].includes(status) ? { status } : {};
    const safePage = Math.max(1, parseInt(page, 10) || 1);
    const safeLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 15));

    const [reviews, total, counts] = await Promise.all([
      Review.find(filter)
        .populate('user', 'fullName username college department')
        .sort({ createdAt: -1 })
        .skip((safePage - 1) * safeLimit)
        .limit(safeLimit)
        .lean(),
      Review.countDocuments(filter),
      Review.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    ]);

    res.status(200).json({
      success: true,
      reviews,
      total,
      hasMore: safePage * safeLimit < total,
      counts: counts.reduce((acc, { _id, count }) => ({ ...acc, [_id]: count }), { pending: 0, approved: 0, declined: 0 }),
    });
  } catch (error) {
    sendServerError(res, error);
  }
});

router.patch('/reviews/:id/review', verifyFirebaseToken, requireRole(['admin', 'moderator']), async (req, res) => {
  const { id } = req.params;
  const { status, adminComment = '' } = req.body;

  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid review id!' });
  if (!['approved', 'declined', 'pending'].includes(status)) {
    return res.status(400).json({ message: 'Invalid moderation status!' });
  }

  try {
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: 'Review not found!' });

    const previousStatus = review.status;
    review.status = status;
    review.adminComment = String(adminComment).trim().slice(0, 500);
    await review.save();

    if (status !== previousStatus && (status === 'approved' || status === 'declined')) {
      const note = review.adminComment ? ` Moderator note: ${review.adminComment}` : '';
      await notifyUser({
        user: review.user,
        type: status === 'approved' ? 'review_approved' : 'review_declined',
        title: 'Your review',
        message:
          status === 'approved'
            ? `Your review was approved and is now on the Reviews page. Thank you!${note}`
            : `Your review was not approved.${note}`,
      });
    }

    res.status(200).json({ success: true, message: `Review marked as ${status.toUpperCase()}!`, review });
  } catch (error) {
    sendServerError(res, error);
  }
});

router.delete('/reviews/:id', verifyFirebaseToken, requireRole(['admin', 'moderator']), async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid review id!' });
    const deleted = await Review.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Review not found!' });
    res.status(200).json({ success: true, message: 'Review deleted.' });
  } catch (error) {
    sendServerError(res, error);
  }
});

// ৬. Promote/Demote Future Moderators (PUT /api/admin/users/role) - Strictly Super Admin Only
router.put('/users/role', verifyFirebaseToken, requireRole(['admin']), async (req, res) => {
  const { username = '', newRole } = req.body;
  const cleanUsername = String(username).toLowerCase().trim();

  if (!['student', 'moderator', 'admin'].includes(newRole)) {
    return res.status(400).json({ message: 'Invalid role specified!' });
  }

  if (cleanUsername === req.adminUser.username && newRole !== 'admin') {
    return res.status(400).json({ message: 'You cannot remove your own admin role!' });
  }

  try {
    const targetUser = await User.findOneAndUpdate({ username: cleanUsername }, { role: newRole }, { new: true });

    if (!targetUser) {
      return res.status(404).json({ message: `User @${username} not found!` });
    }

    res.status(200).json({
      success: true,
      message: `@${targetUser.username} is now assigned as ${newRole.toUpperCase()}!`,
      user: targetUser,
    });
  } catch (error) {
    sendServerError(res, error);
  }
});

export default router;
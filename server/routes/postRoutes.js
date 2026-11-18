// server/routes/postRoutes.js
import express from 'express';
import mongoose from 'mongoose';
import sanitizeHtml from 'sanitize-html';
import { Post, POST_TYPES, FONTS } from '../models/Post.js';
import { User, COLLEGES, DEPARTMENTS, SESSIONS } from '../models/User.js';
import { Notification } from '../models/Notification.js';
import { verifyFirebaseToken, optionalFirebaseToken, requireVerifiedEmail } from '../middlewares/authMiddleware.js';
import { validateAndUnmaskLink, inspectLink, linkErrorResponse } from '../middlewares/linkValidator.js';
import { sendServerError } from '../utils/httpError.js';
import { notifyUser } from '../utils/notify.js';
import { registerView, viewerKeyFor } from '../utils/views.js';

const router = express.Router();

const escapeRegex = (text) => String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const SORT_OPTIONS = ['newest', 'loved', 'viewed'];
const AUTHOR_FIELDS = 'fullName username college department badges avatarColor avatarUrl bio';
// Fields that must never reach the public (download links stay locked, reporter ids & admin notes stay private)
const PUBLIC_EXCLUDE = '-viewedBy -reports -externalLink -unmaskedLink -adminComment -aiSafetyNote';

// Allow ONLY text-formatting tags and https links. Every attribute (onclick, style, onerror...) is stripped.
const sanitizeArticleContent = (rawHtml = '') =>
  sanitizeHtml(String(rawHtml), {
    allowedTags: ['b', 'strong', 'i', 'em', 'u', 's', 'br', 'p', 'div', 'span', 'a', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre'],
    allowedAttributes: { a: ['href', 'target', 'rel'] },
    allowedSchemes: ['https'],
    allowProtocolRelative: false,
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { target: '_blank', rel: 'noopener noreferrer nofollow' }),
    },
  });

const toPlainText = (html) => sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} });

// Public shape of a post. `lovedByMe` tells the client if the signed-in viewer loved it, without exposing voter ids.
const toPublicPost =
  (viewerId) =>
  ({ externalLink, unmaskedLink, reports, adminComment, aiSafetyNote, viewedBy, lovedBy = [], ...rest }) => ({
    ...rest,
    likesCount: lovedBy.length,
    lovedByMe: Boolean(viewerId) && lovedBy.some((id) => id.toString() === viewerId),
    isLinkLocked: true,
  });

// Popular tags are the same for everybody, so cache them for 5 minutes instead of aggregating on every request
const TAG_CACHE_MS = 5 * 60 * 1000;
let tagCache = { at: 0, tags: [] };

const getPopularTags = async () => {
  if (Date.now() - tagCache.at < TAG_CACHE_MS) return tagCache.tags;

  const tagStats = await Post.aggregate([
    { $match: { status: 'approved' } },
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 20 },
  ]);
  tagCache = { at: Date.now(), tags: tagStats.map(({ _id }) => _id) };
  return tagCache.tags;
};

// Shared by "create" and "edit": validates and cleans everything the author can send
const parsePostInput = (body = {}) => {
  const {
    type,
    title,
    content = '',
    fontFamily = 'Inter',
    college,
    department,
    session,
    resourceCredit = '',
    tags = [],
  } = body;

  const cleanTitle = String(title ?? '').trim();

  if (!POST_TYPES.includes(type)) return { error: 'Invalid post type!' };
  if (!cleanTitle) return { error: 'Title is required!' };
  if (cleanTitle.length > 150) return { error: 'Title is too long (max 150 characters).' };
  if (!COLLEGES.includes(college)) return { error: 'Invalid college!' };
  if (!DEPARTMENTS.includes(department)) return { error: 'Invalid department!' };
  if (!SESSIONS.includes(session)) return { error: 'Invalid session!' };
  if (!Array.isArray(tags)) return { error: 'Tags must be a list!' };

  const cleanContent = sanitizeArticleContent(content);
  if (toPlainText(cleanContent).length > 20000) return { error: 'Content is too long (max 20,000 characters).' };
  // The HTML itself also has a hard limit, so the database never rejects it with a 500 error
  if (cleanContent.length > 60000) return { error: 'Content has too much formatting. Please shorten it.' };

  // Requirement: Array Methods (.map, .filter) to clean & normalize tags
  const cleanTags = tags
    .map((tag) => String(tag).toLowerCase().replace(/[^a-z0-9+#-]/g, '').trim())
    .filter((tag) => tag.length > 1);

  return {
    values: {
      type,
      title: cleanTitle,
      content: cleanContent,
      fontFamily: FONTS.includes(fontFamily) ? fontFamily : 'Inter',
      college,
      department,
      session,
      resourceCredit: String(resourceCredit).trim().slice(0, 120),
      tags: Array.from(new Set(cleanTags)).slice(0, 6),
    },
  };
};

// 1. Create post -> goes to admin review ('pending')
router.post('/create', verifyFirebaseToken, requireVerifiedEmail, validateAndUnmaskLink, async (req, res) => {
  const { uid } = req.firebaseUser;
  const { originalLink, unmaskedLink, aiSafetyNote } = req.linkMeta;

  const { error, values } = parsePostInput(req.body);
  if (error) return res.status(400).json({ message: error });

  try {
    const author = await User.findOne({ firebaseUid: uid });
    if (!author) return res.status(404).json({ message: 'User profile not found!' });

    const newPost = await Post.create({
      ...values,
      author: author._id,
      externalLink: originalLink,
      unmaskedLink,
      aiSafetyNote,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Submitted successfully! Waiting for Admin review.',
      post: newPost,
    });
  } catch (err) {
    sendServerError(res, err);
  }
});

// 2. Public feed with filters, sorting and pagination (guest-safe: download links are hidden).
// A token is optional: signed-in users also get `lovedByMe` for every post.
router.get('/feed', optionalFirebaseToken, async (req, res) => {
  const { college, department, session, type, tag, search, sort: rawSort, page = '1', limit = '50' } = req.query;
  const isText = (value) => typeof value === 'string' && value.length > 0;
  const sort = SORT_OPTIONS.includes(rawSort) ? rawSort : 'newest';

  try {
    const query = { status: 'approved' };

    if (isText(college) && college !== 'All') query.college = college;
    if (isText(department) && department !== 'All') query.department = department;
    if (isText(session) && session !== 'All') query.session = session;
    if (isText(type) && POST_TYPES.includes(type)) query.type = type;
    if (isText(tag)) query.tags = tag.toLowerCase().trim();
    if (isText(search)) {
      const pattern = new RegExp(escapeRegex(search.trim().slice(0, 50)), 'i');
      query.$or = [{ title: pattern }, { tags: pattern }];
    }

    const safePage = Math.max(1, parseInt(page, 10) || 1);
    const safeLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 12));
    const skip = (safePage - 1) * safeLimit;

    const viewer = req.firebaseUser
      ? await User.findOne({ firebaseUid: req.firebaseUser.uid }).select('_id').lean()
      : null;
    const viewerId = viewer?._id.toString();

    const loadPosts = () => {
      // "Most loved" needs the size of the lovedBy array, so it uses an aggregation
      if (sort === 'loved') {
        return Post.aggregate([
          { $match: query },
          { $addFields: { loveCount: { $size: { $ifNull: ['$lovedBy', []] } } } },
          { $sort: { loveCount: -1, createdAt: -1 } },
          { $skip: skip },
          { $limit: safeLimit },
          {
            $project: {
              loveCount: 0,
              viewedBy: 0,
              reports: 0,
              externalLink: 0,
              unmaskedLink: 0,
              adminComment: 0,
              aiSafetyNote: 0,
            },
          },
        ]).then((rows) => Post.populate(rows, { path: 'author', select: AUTHOR_FIELDS }));
      }

      return Post.find(query)
        .select(PUBLIC_EXCLUDE)
        .populate('author', AUTHOR_FIELDS)
        .sort(sort === 'viewed' ? { views: -1, createdAt: -1 } : { createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .lean();
    };

    const [posts, totalPosts, popularTags] = await Promise.all([
      loadPosts(),
      Post.countDocuments(query),
      getPopularTags(),
    ]);

    // Requirement: Array Method (.map)
    const publicSafePosts = posts.map(toPublicPost(viewerId));
    const totalPages = Math.ceil(totalPosts / safeLimit);

    res.status(200).json({
      success: true,
      posts: publicSafePosts,
      popularTags,
      page: safePage,
      totalPages,
      totalPosts,
      hasMore: safePage < totalPages,
    });
  } catch (err) {
    sendServerError(res, err);
  }
});

// 3. One post in full (GET /api/posts/:id). Approved posts are public.
// The author (and staff) can also open their own pending/declined posts. Only the author receives the link.
router.get('/:id', optionalFirebaseToken, async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid post id!' });

  try {
    const viewer = req.firebaseUser
      ? await User.findOne({ firebaseUid: req.firebaseUser.uid }).select('_id role').lean()
      : null;
    const viewerId = viewer?._id.toString();

    const post = await Post.findById(id).select('-viewedBy').populate('author', AUTHOR_FIELDS).lean();
    if (!post) return res.status(404).json({ message: 'Post not found!' });

    const isOwner = Boolean(viewerId) && post.author?._id.toString() === viewerId;
    const isStaff = ['admin', 'moderator'].includes(viewer?.role);

    // Not public yet: hide it from everyone except the author and staff
    if (post.status !== 'approved' && !isOwner && !isStaff) {
      return res.status(404).json({ message: 'Post not found or still under review!' });
    }

    const publicPost = toPublicPost(viewerId)(post);
    res.status(200).json({
      success: true,
      post: isOwner
        ? { ...publicPost, isOwner: true, externalLink: post.externalLink, adminComment: post.adminComment }
        : { ...publicPost, isOwner: false },
    });
  } catch (err) {
    sendServerError(res, err);
  }
});

// 4. Edit and resubmit (author only). Every edit sends the post back to the review queue.
router.patch('/:id', verifyFirebaseToken, requireVerifiedEmail, async (req, res) => {
  const { id } = req.params;
  const { uid } = req.firebaseUser;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid post id!' });

  const { error, values } = parsePostInput(req.body);
  if (error) return res.status(400).json({ message: error });

  try {
    const user = await User.findOne({ firebaseUid: uid }).select('_id');
    if (!user) return res.status(404).json({ message: 'User profile not found!' });

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found!' });
    if (!post.author.equals(user._id)) {
      return res.status(403).json({ message: 'You can only edit your own posts.' });
    }

    // A changed link goes through the same safety checks as a new upload
    const newLink = String(req.body.externalLink ?? '').trim();
    if (newLink && newLink !== post.externalLink) {
      try {
        const meta = await inspectLink(newLink, { title: values.title, type: values.type });
        post.externalLink = meta.originalLink;
        post.unmaskedLink = meta.unmaskedLink;
        post.aiSafetyNote = meta.aiSafetyNote;
      } catch (linkError) {
        const { status: code, body } = linkErrorResponse(linkError);
        return res.status(code).json(body);
      }
    }

    Object.assign(post, values);
    post.status = 'pending';
    post.reports = [];
    post.adminComment = '';
    await post.save();

    res.status(200).json({
      success: true,
      message: 'Changes saved! Your post is back in the review queue.',
      post,
    });
  } catch (err) {
    sendServerError(res, err);
  }
});

// 5. Delete own post
router.delete('/:id', verifyFirebaseToken, async (req, res) => {
  const { id } = req.params;
  const { uid } = req.firebaseUser;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid post id!' });

  try {
    const user = await User.findOne({ firebaseUid: uid }).select('_id');
    if (!user) return res.status(404).json({ message: 'User profile not found!' });

    const post = await Post.findById(id).select('author');
    if (!post) return res.status(404).json({ message: 'Post not found!' });
    if (!post.author.equals(user._id)) {
      return res.status(403).json({ message: 'You can only delete your own posts.' });
    }

    await Post.deleteOne({ _id: id });
    await Notification.deleteMany({ post: id });

    res.status(200).json({ success: true, message: 'Post deleted.' });
  } catch (err) {
    sendServerError(res, err);
  }
});

// 6. Protected download / open link (logged-in only) + view counter (one view per user)
router.post('/:id/access-link', verifyFirebaseToken, async (req, res) => {
  const { id } = req.params;
  const { uid } = req.firebaseUser;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid post id!' });

  try {
    const user = await User.findOne({ firebaseUid: uid }).select('_id').lean();
    if (!user) return res.status(404).json({ message: 'User profile not found!' });

    const post = await Post.findOne({ _id: id, status: 'approved' }).select('unmaskedLink externalLink views');
    if (!post) return res.status(404).json({ message: 'Resource not found or under review!' });

    // Opening the link counts as a view (once per person every 30 minutes, shared with the post page)
    const { views } = await registerView(post, viewerKeyFor(req, user._id));

    res.status(200).json({
      success: true,
      downloadUrl: post.unmaskedLink || post.externalLink,
      views,
    });
  } catch (err) {
    sendServerError(res, err);
  }
});

// 6b. Count a view when the post page is opened (guests included). No login needed.
router.post('/:id/view', optionalFirebaseToken, async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid post id!' });

  try {
    const viewer = req.firebaseUser
      ? await User.findOne({ firebaseUid: req.firebaseUser.uid }).select('_id').lean()
      : null;

    const post = await Post.findOne({ _id: id, status: 'approved' }).select('views');
    if (!post) return res.status(404).json({ message: 'Post not found or not live!' });

    const { counted, views } = await registerView(post, viewerKeyFor(req, viewer?._id));
    res.status(200).json({ success: true, counted, views });
  } catch (err) {
    sendServerError(res, err);
  }
});

// 7. Love react toggle (every step is one atomic update, so double clicks cannot race)
router.post('/:id/love', verifyFirebaseToken, async (req, res) => {
  const { id } = req.params;
  const { uid } = req.firebaseUser;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid post id!' });

  try {
    const user = await User.findOne({ firebaseUid: uid }).select('_id').lean();
    if (!user) return res.status(404).json({ message: 'User profile not found!' });

    // Try to remove the love first. If it was there, we are done (unloved).
    const unloved = await Post.findOneAndUpdate(
      { _id: id, status: 'approved', lovedBy: user._id },
      { $pull: { lovedBy: user._id } },
      { new: true }
    ).select('lovedBy');
    if (unloved) return res.status(200).json({ success: true, loved: false, likesCount: unloved.lovedBy.length });

    // Otherwise add it ($addToSet never duplicates)
    const loved = await Post.findOneAndUpdate(
      { _id: id, status: 'approved' },
      { $addToSet: { lovedBy: user._id } },
      { new: true }
    ).select('lovedBy');
    if (!loved) return res.status(404).json({ message: 'Post not found!' });

    res.status(200).json({ success: true, loved: true, likesCount: loved.lovedBy.length });
  } catch (err) {
    sendServerError(res, err);
  }
});

// 8. Report broken/expired link -> admin queue ('reported')
router.post('/:id/report', verifyFirebaseToken, async (req, res) => {
  const { id } = req.params;
  const { reason = '' } = req.body;
  const { uid } = req.firebaseUser;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid post id!' });

  try {
    const user = await User.findOne({ firebaseUid: uid }).select('_id');
    if (!user) return res.status(404).json({ message: 'User profile not found!' });

    // Only live posts can be reported (a pending/declined post must not jump the moderation queue)
    const post = await Post.findOne({ _id: id, status: 'approved' });
    if (!post) return res.status(404).json({ message: 'Post not found or not live!' });

    // Requirement: Array Method (.some) - one report per user
    const alreadyReported = post.reports.some(({ reportedBy }) => reportedBy.toString() === user._id.toString());
    if (alreadyReported) return res.status(409).json({ message: 'You already reported this post.' });

    post.reports.push({
      reportedBy: user._id,
      reason: String(reason).trim().slice(0, 300) || 'Broken or expired drive link',
    });

    // The post stays live until several different people report it, so one user cannot remove a post alone.
    // Set REPORT_THRESHOLD in .env to change it (default 3).
    const threshold = Number(process.env.REPORT_THRESHOLD) || 3;
    const becameReported = post.status !== 'reported' && post.reports.length >= threshold;
    if (becameReported) post.status = 'reported';
    await post.save();

    if (becameReported) {
      await notifyUser({
        user: post.author,
        type: 'reported',
        post: post._id,
        title: post.title,
        message: 'Readers reported the link in this post. A moderator will review it, or you can edit the post with a working link.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Report submitted! Admin will review or update this link shortly.',
    });
  } catch (err) {
    sendServerError(res, err);
  }
});

export default router;
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
import { getPreviewUrl, normalizeLinkKey } from '../utils/linkKey.js';
import { findDuplicatePost } from '../utils/duplicateCheck.js';
import { getDailyUsage } from '../utils/dailyLimit.js';
import { resolveTags, loadCatalog, findTagSlugsMatching, MAX_TAGS_PER_POST } from '../utils/tagService.js';
import { findSubject, SEMESTER_COUNT } from '../data/syllabusIndex.js';

const router = express.Router();

const escapeRegex = (text) => String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const SORT_OPTIONS = ['newest', 'loved', 'viewed'];
const AUTHOR_FIELDS = 'fullName username college department badges avatarColor avatarUrl bio';
// Exclude internal arrays and admin notes in DB queries; externalLink/unmaskedLink are stripped in toPublicPost after computing previewUrl
const PUBLIC_EXCLUDE = '-viewedBy -reports -adminComment -aiSafetyNote';

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

// Public shape of a post. Signed-in viewers get previewUrl + lovedByMe/isLoved; guests only get hasPreview.
// Download links, reporter ids and admin notes are never sent here.
const toPublicPost =
  (viewerId, hiddenTags = new Set()) =>
  ({ externalLink, unmaskedLink, reports, adminComment, aiSafetyNote, viewedBy, lovedBy = [], tags = [], ...rest }) => {
    const previewUrl = getPreviewUrl(unmaskedLink || externalLink);
    const loved = Boolean(viewerId) && lovedBy.some((id) => id.toString() === viewerId);
    return {
      ...rest,
      tags: tags.filter((tag) => !hiddenTags.has(tag)),
      likesCount: lovedBy.length,
      lovedByMe: loved,
      isLoved: loved,
      hasPreview: Boolean(previewUrl),
      previewUrl: viewerId ? previewUrl : null,
      isLinkLocked: !viewerId,
    };
  };

// Daily upload limit. Runs BEFORE the (slow) link scan, so spammers cost us almost nothing.
const enforceDailyLimit = async (req, res, next) => {
  try {
    const author = await User.findOne({ firebaseUid: req.firebaseUser.uid });
    if (!author) return res.status(404).json({ message: 'User profile not found!' });

    const usage = await getDailyUsage(author);
    if (!usage.unlimited && usage.remaining <= 0) {
      const hours = Math.max(1, Math.ceil((usage.resetsAt.getTime() - Date.now()) / (60 * 60 * 1000)));
      return res.status(429).json({
        success: false,
        message: `Daily upload limit reached (${usage.limit} posts per 24 hours). You can post again in about ${hours} hour${hours > 1 ? 's' : ''}.`,
        resetsAt: usage.resetsAt,
      });
    }

    req.postAuthor = author;
    next();
  } catch (err) {
    sendServerError(res, err);
  }
};

// Shared by "create" and "edit": validates and cleans everything the author can send
const parsePostInput = async (body = {}, author = null) => {
  const {
    type,
    title,
    content = '',
    fontFamily = 'Inter',
    college,
    department,
    session,
    semester,
    subjectCode,
    resourceCredit = '',
    tags = [],
  } = body;

  const cleanTitle = String(title ?? '').trim();

  if (!POST_TYPES.includes(type)) return { error: 'Invalid post type!' };
  if (!cleanTitle) return { error: 'Title is required!' };
  if (cleanTitle.length > 150) return { error: 'Title is too long (max 150 characters).' };
  if (!Array.isArray(tags)) return { error: 'Tags must be a list!' };

  // Notes & slides must specify a valid syllabus subject (department > semester > subject).
  let subject = null;
  if (type === 'resource') {
    subject = findSubject(String(department), Number(semester), String(subjectCode));
    if (!subject) {
      return { error: 'Choose a valid department, semester and subject for notes and slides.' };
    }
  }

  const resolvedCollege = college && COLLEGES.includes(college) ? college : author?.college || 'General';
  const resolvedDepartment = subject
    ? String(department)
    : department && DEPARTMENTS.includes(department)
    ? department
    : author?.department || 'General';
  const resolvedSession = session && SESSIONS.includes(session) ? session : author?.session || 'General';

  const cleanContent = sanitizeArticleContent(content);
  if (toPlainText(cleanContent).length > 20000) return { error: 'Content is too long (max 20,000 characters).' };
  if (cleanContent.length > 60000) return { error: 'Content has too much formatting. Please shorten it.' };

  // Aliases become the official name ("ds" -> "dsa"), duplicates and hidden tags are dropped, max 5
  const cleanTags = await resolveTags(tags.slice(0, 20));

  return {
    values: {
      type,
      title: cleanTitle,
      content: cleanContent,
      fontFamily: FONTS.includes(fontFamily) ? fontFamily : 'Inter',
      college: resolvedCollege,
      department: resolvedDepartment,
      session: resolvedSession,
      semester: subject ? Number(semester) : null,
      subjectCode: subject ? subject.code : '',
      subjectName: subject ? subject.name : '',
      resourceCredit: String(resourceCredit).trim().slice(0, 120),
      tags: cleanTags,
    },
  };
};

// 0. How many uploads the signed-in user has left today (shown on the create-post page)
router.get('/my-limit', verifyFirebaseToken, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.firebaseUser.uid }).select('_id role');
    if (!user) return res.status(404).json({ message: 'User profile not found!' });

    res.status(200).json({ success: true, ...(await getDailyUsage(user)) });
  } catch (err) {
    sendServerError(res, err);
  }
});

// 1. Create post -> goes to admin review ('pending')
router.post(
  '/create',
  verifyFirebaseToken,
  requireVerifiedEmail,
  enforceDailyLimit,
  validateAndUnmaskLink,
  async (req, res) => {
    const { originalLink, unmaskedLink, aiSafetyNote } = req.linkMeta;

    try {
      const author = req.postAuthor || (await User.findOne({ firebaseUid: req.firebaseUser.uid }));
      if (!author) return res.status(404).json({ message: 'User profile not found!' });

      const { error, values } = await parsePostInput(req.body, author);
      if (error) return res.status(400).json({ message: error });

      const duplicate = await findDuplicatePost({ originalLink, unmaskedLink });
      if (duplicate) return res.status(409).json({ success: false, message: duplicate.message, duplicate });

      const newPost = await Post.create({
        ...values,
        author: author._id,
        externalLink: originalLink,
        unmaskedLink,
        linkKey: normalizeLinkKey(unmaskedLink),
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
  }
);

// 2. Public feed with filters, sorting and pagination (guest-safe: download links are hidden).
// Filters: college, department, session, semester, subject, type, tag (comma-separated, all must match), search, sort.
router.get('/feed', optionalFirebaseToken, async (req, res) => {
  const {
    college,
    department,
    session,
    semester,
    subject,
    type,
    tag,
    search,
    sort: rawSort,
    page = '1',
    limit = '12',
  } = req.query;
  const isText = (value) => typeof value === 'string' && value.length > 0;
  const sort = SORT_OPTIONS.includes(rawSort) ? rawSort : 'newest';

  try {
    // Filters shared by the list and by the "popular tags" box (which must not shrink when a tag is picked)
    const baseQuery = { status: 'approved' };
    if (isText(college) && college !== 'All') baseQuery.college = college;
    if (isText(department) && department !== 'All') baseQuery.department = department;
    if (isText(session) && session !== 'All') baseQuery.session = session;
    const semesterNumber = parseInt(semester, 10);
    if (semesterNumber >= 1 && semesterNumber <= SEMESTER_COUNT) baseQuery.semester = semesterNumber;
    if (isText(subject) && subject !== 'All') baseQuery.subjectCode = subject;
    if (isText(type) && POST_TYPES.includes(type)) baseQuery.type = type;

    const query = { ...baseQuery };

    // ?tag=ds,midterm -> aliases are converted ("ds" -> "dsa") and a post must have ALL the tags
    if (isText(tag)) {
      const slugs = await resolveTags(tag.split(',').slice(0, MAX_TAGS_PER_POST), { createMissing: false });
      query.tags = slugs.length > 0 ? { $all: slugs } : '__no_such_tag__';
    }

    // Search also finds posts through tag aliases and the subject name or code
    if (isText(search)) {
      const text = search.trim().slice(0, 50);
      const pattern = new RegExp(escapeRegex(text), 'i');
      const tagSlugs = await findTagSlugsMatching(text);
      query.$or = [
        { title: pattern },
        { tags: pattern },
        { subjectName: pattern },
        { subjectCode: pattern },
        ...(tagSlugs.length > 0 ? [{ tags: { $in: tagSlugs } }] : []),
      ];
    }

    const safePage = Math.max(1, parseInt(page, 10) || 1);
    const safeLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 12));
    const skip = (safePage - 1) * safeLimit;

    const [viewer, catalog] = await Promise.all([
      req.firebaseUser
        ? User.findOne({ firebaseUid: req.firebaseUser.uid }).select('_id').lean()
        : Promise.resolve(null),
      loadCatalog(),
    ]);
    const viewerId = viewer?._id.toString() || null;

    const loadPosts = () => {
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

    const tasks = [loadPosts(), Post.countDocuments(query)];
    // Popular tags are needed only once (page 1), scoped to the current non-tag filters
    if (safePage === 1) {
      tasks.push(
        Post.aggregate([
          { $match: baseQuery },
          { $unwind: '$tags' },
          { $group: { _id: '$tags', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 40 },
        ])
      );
    }

    const [posts, totalPosts, tagStats = []] = await Promise.all(tasks);

    const popularTags = tagStats
      .filter(({ _id }) => !catalog.hidden.has(_id))
      .slice(0, 20)
      .map(({ _id, count }) => ({ slug: _id, label: catalog.bySlug.get(_id)?.label || _id, count }));

    const publicSafePosts = posts.map(toPublicPost(viewerId, catalog.hidden));
    const totalPages = Math.max(1, Math.ceil(totalPosts / safeLimit));

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
    const [viewer, catalog] = await Promise.all([
      req.firebaseUser
        ? User.findOne({ firebaseUid: req.firebaseUser.uid }).select('_id role').lean()
        : Promise.resolve(null),
      loadCatalog(),
    ]);
    const viewerId = viewer?._id.toString() || null;

    const post = await Post.findById(id).select('-viewedBy').populate('author', AUTHOR_FIELDS).lean();
    if (!post) return res.status(404).json({ message: 'Post not found!' });

    const isOwner = Boolean(viewerId) && post.author?._id.toString() === viewerId;
    const isStaff = ['admin', 'moderator'].includes(viewer?.role);

    // Not public yet: hide it from everyone except the author and staff
    if (post.status !== 'approved' && !isOwner && !isStaff) {
      return res.status(404).json({ message: 'Post not found or still under review!' });
    }

    const publicPost = toPublicPost(viewerId, catalog.hidden)(post);
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

  try {
    const user = await User.findOne({ firebaseUid: uid }).select('_id college department session');
    if (!user) return res.status(404).json({ message: 'User profile not found!' });

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found!' });
    if (!post.author.equals(user._id)) {
      return res.status(403).json({ message: 'You can only edit your own posts.' });
    }

    const { error, values } = await parsePostInput(req.body, user);
    if (error) return res.status(400).json({ message: error });

    // A changed link goes through the same safety & duplicate checks as a new upload
    const newLink = String(req.body.externalLink ?? '').trim();
    if (newLink && newLink !== post.externalLink) {
      try {
        const meta = await inspectLink(newLink, { title: values.title, type: values.type });
        const duplicate = await findDuplicatePost({
          originalLink: meta.originalLink,
          unmaskedLink: meta.unmaskedLink,
          excludePostId: post._id,
        });
        if (duplicate) return res.status(409).json({ success: false, message: duplicate.message, duplicate });

        post.externalLink = meta.originalLink;
        post.unmaskedLink = meta.unmaskedLink;
        post.linkKey = normalizeLinkKey(meta.unmaskedLink || meta.originalLink);
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
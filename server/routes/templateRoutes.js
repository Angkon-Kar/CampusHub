// server/routes/templateRoutes.js
// Views and "love" reactions for the CV templates on /cv-guide (same idea as the resource cards).
//   GET  /api/templates/stats       public. Guests get the counts. A logged-in user also gets lovedIds.
//   POST /api/templates/:id/view    login needed. Counts one open or download.
//   POST /api/templates/:id/love    login needed. Toggles the love reaction.
import express from 'express';
import rateLimit from 'express-rate-limit';
import admin from '../config/firebaseAdmin.js';
import { User } from '../models/User.js';
import { TemplateStat } from '../models/TemplateStat.js';
import { verifyFirebaseToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

const TEMPLATE_COUNT = 22; // keep the same as TEMPLATES.length in client/src/constants/cvGuide.js

const parseTemplateId = (raw) => {
  const id = Number(String(raw).replace(/^0+/, ''));
  return Number.isInteger(id) && id >= 1 && id <= TEMPLATE_COUNT ? id : null;
};

// Stops one person from inflating the counters (the global limiter in server.js still applies on top)
const actionLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 40,
  message: { success: false, message: 'Too many requests, please slow down.' },
});

// Guests may read the counts, so the token is optional here: a bad or missing token just means "guest"
const readOptionalUser = async (req) => {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) return null;
  try {
    const { uid } = await admin.auth().verifyIdToken(token);
    return await User.findOne({ firebaseUid: uid }).select('_id').lean();
  } catch {
    return null;
  }
};

// Two requests that create the same template document at the same moment can collide once: retry once
const upsertTemplate = async (templateId, update) => {
  const run = () => TemplateStat.findOneAndUpdate({ templateId }, update, { upsert: true, new: true });
  try {
    return await run();
  } catch (error) {
    if (error?.code === 11000) return run();
    throw error;
  }
};

// 1. Counts for every template (+ which ones the current user loved)
router.get('/stats', async (req, res) => {
  try {
    const me = await readOptionalUser(req);
    const rows = await TemplateStat.aggregate([
      {
        $project: {
          _id: 0,
          templateId: 1,
          views: { $ifNull: ['$views', 0] },
          loves: { $size: { $ifNull: ['$lovedBy', []] } },
          lovedByMe: me ? { $in: [me._id, { $ifNull: ['$lovedBy', []] }] } : { $literal: false },
        },
      },
    ]);

    const stats = {};
    for (let id = 1; id <= TEMPLATE_COUNT; id += 1) stats[id] = { views: 0, loves: 0 };
    const lovedIds = [];

    rows.forEach(({ templateId, views, loves, lovedByMe }) => {
      if (!stats[templateId]) return;
      stats[templateId] = { views, loves };
      if (lovedByMe) lovedIds.push(templateId);
    });

    res.set('Cache-Control', 'no-store');
    return res.status(200).json({ success: true, stats, lovedIds });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 2. Count one view (the client calls this when a logged-in user opens or downloads a template)
router.post('/:id/view', verifyFirebaseToken, actionLimiter, async (req, res) => {
  const templateId = parseTemplateId(req.params.id);
  if (!templateId) return res.status(400).json({ success: false, message: 'Invalid template id!' });

  try {
    const doc = await upsertTemplate(templateId, { $inc: { views: 1 } });
    return res.status(200).json({ success: true, views: doc.views });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 3. Love react toggle (atomic: safe even if the user double-clicks)
router.post('/:id/love', verifyFirebaseToken, actionLimiter, async (req, res) => {
  const templateId = parseTemplateId(req.params.id);
  if (!templateId) return res.status(400).json({ success: false, message: 'Invalid template id!' });

  try {
    const user = await User.findOne({ firebaseUid: req.firebaseUser.uid }).select('_id');
    if (!user) return res.status(404).json({ success: false, message: 'User profile not found!' });

    const alreadyLoved = await TemplateStat.exists({ templateId, lovedBy: user._id });
    const update = alreadyLoved ? { $pull: { lovedBy: user._id } } : { $addToSet: { lovedBy: user._id } };
    const doc = await upsertTemplate(templateId, update);

    return res.status(200).json({ success: true, loved: !alreadyLoved, loves: doc.lovedBy.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
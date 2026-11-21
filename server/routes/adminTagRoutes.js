// server/routes/adminTagRoutes.js
// Tag management for admins and moderators. Mounted at /api/admin/tags.
import express from 'express';
import { Tag } from '../models/Tag.js';
import { Post } from '../models/Post.js';
import { verifyFirebaseToken } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';
import {
  TagError,
  normalizeTagSlug,
  assertNameFree,
  mergeTags,
  invalidateTagCaches,
} from '../utils/tagService.js';

const router = express.Router();
router.use(verifyFirebaseToken, requireRole(['admin', 'moderator']));

const escapeRegex = (text) => String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const sendError = (res, error) =>
  res.status(error instanceof TagError ? error.statusCode : 500).json({ success: false, message: error.message });

// 1. List tags with usage counts (GET /api/admin/tags?search=ds&filter=hidden|unofficial)
router.get('/', async (req, res) => {
  const { search = '', filter = '' } = req.query;

  try {
    const query = {};
    const needle = normalizeTagSlug(search);
    if (needle) {
      const pattern = new RegExp(escapeRegex(needle), 'i');
      query.$or = [{ slug: pattern }, { aliases: pattern }, { label: new RegExp(escapeRegex(String(search).trim()), 'i') }];
    }
    if (filter === 'hidden') query.hidden = true;
    if (filter === 'unofficial') query.official = false;

    const [tags, usage] = await Promise.all([
      Tag.find(query).lean(),
      Post.aggregate([
        { $unwind: '$tags' },
        {
          $group: {
            _id: '$tags',
            total: { $sum: 1 },
            live: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
          },
        },
      ]),
    ]);

    const usageBySlug = new Map(usage.map(({ _id, total, live }) => [_id, { total, live }]));
    const rows = tags
      .map(({ _id, slug, label, aliases = [], hidden, official }) => ({
        _id,
        slug,
        label,
        aliases,
        hidden,
        official,
        liveCount: usageBySlug.get(slug)?.live || 0,
        totalCount: usageBySlug.get(slug)?.total || 0,
      }))
      .sort((a, b) => b.totalCount - a.totalCount || a.slug.localeCompare(b.slug))
      .slice(0, 300);

    res.status(200).json({ success: true, tags: rows });
  } catch (error) {
    sendError(res, error);
  }
});

// 2. Create an official tag (POST /api/admin/tags)  body: { slug, label, aliases }
router.post('/', async (req, res) => {
  const { label = '', aliases = [] } = req.body;
  const slug = normalizeTagSlug(req.body.slug || label);

  try {
    if (slug.length < 2) throw new TagError('Tag name must have at least 2 characters.');
    await assertNameFree(slug, null);

    const cleanAliases = [...new Set((Array.isArray(aliases) ? aliases : []).map(normalizeTagSlug))].filter(
      (alias) => alias.length >= 2 && alias !== slug
    );
    for (const alias of cleanAliases) await assertNameFree(alias, null);

    const tag = await Tag.create({ slug, label: String(label).trim() || slug, aliases: cleanAliases, official: true });
    invalidateTagCaches();
    res.status(201).json({ success: true, message: `Tag #${slug} created.`, tag });
  } catch (error) {
    sendError(res, error);
  }
});

// 3. Edit: label, add/remove aliases, hide/show, official (PATCH /api/admin/tags/:slug)
router.patch('/:slug', async (req, res) => {
  const { label, addAliases = [], removeAliases = [], hidden, official } = req.body;

  try {
    const tag = await Tag.findOne({ slug: normalizeTagSlug(req.params.slug) });
    if (!tag) throw new TagError('Tag not found.', 404);

    if (typeof label === 'string' && label.trim()) tag.label = label.trim().slice(0, 60);
    if (typeof hidden === 'boolean') tag.hidden = hidden;
    if (typeof official === 'boolean') tag.official = official;

    for (const raw of Array.isArray(addAliases) ? addAliases : []) {
      const alias = normalizeTagSlug(raw);
      if (alias.length < 2 || alias === tag.slug || tag.aliases.includes(alias)) continue;
      await assertNameFree(alias, tag.slug);
      tag.aliases.push(alias);
    }
    const toRemove = new Set((Array.isArray(removeAliases) ? removeAliases : []).map(normalizeTagSlug));
    tag.aliases = tag.aliases.filter((alias) => !toRemove.has(alias));

    await tag.save();
    invalidateTagCaches();
    res.status(200).json({ success: true, message: `Tag #${tag.slug} updated.`, tag });
  } catch (error) {
    sendError(res, error);
  }
});

// 4. Merge one tag into another (POST /api/admin/tags/merge)  body: { from, into }
router.post('/merge', async (req, res) => {
  try {
    const into = await mergeTags(req.body.from, req.body.into);
    res.status(200).json({
      success: true,
      message: `Merged into #${into.slug}. Old posts were updated.`,
      tag: into,
    });
  } catch (error) {
    sendError(res, error);
  }
});

export default router;

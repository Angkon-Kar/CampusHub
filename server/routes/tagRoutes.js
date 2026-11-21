// server/routes/tagRoutes.js
// Public tag endpoints used by the autocomplete box on the create-post page.
import express from 'express';
import { suggestTags, loadCatalog, normalizeTagSlug } from '../utils/tagService.js';

const router = express.Router();

// GET /api/tags/suggest?q=ds  ->  { suggestions: [{ slug, label, count, official }], exact, didYouMean, canCreate }
router.get('/suggest', async (req, res) => {
  try {
    const limit = Math.min(15, Math.max(1, parseInt(req.query.limit, 10) || 8));
    const result = await suggestTags(String(req.query.q ?? '').slice(0, 40), limit);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/tags/resolve?name=data%20structures  ->  the official slug for what was typed
router.get('/resolve', async (req, res) => {
  try {
    const slug = normalizeTagSlug(req.query.name);
    if (slug.length < 2) return res.status(400).json({ message: 'Tag must have at least 2 characters.' });

    const catalog = await loadCatalog();
    const canonical = catalog.byName.get(slug) ?? slug;
    if (catalog.hidden.has(canonical)) return res.status(400).json({ message: 'This tag is not allowed.' });

    const tag = catalog.bySlug.get(canonical);
    res.status(200).json({ success: true, slug: canonical, label: tag?.label || canonical, isNew: !tag });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

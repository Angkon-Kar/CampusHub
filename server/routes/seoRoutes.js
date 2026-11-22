// server/routes/seoRoutes.js
// Serves /sitemap.xml and /robots.txt. On Vercel these two paths are rewritten to this server (see vercel.json).
import express from 'express';
import { Post, POST_TYPES } from '../models/Post.js';
import { User, COLLEGES } from '../models/User.js';

const router = express.Router();

const CACHE_MS = 60 * 60 * 1000; // rebuild the sitemap at most once an hour
const MAX_URLS = 45000; // Google limit is 50,000 per sitemap file
let cache = { xml: '', builtAt: 0 };

const getSiteUrl = () => (process.env.SITE_URL || process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/+$/, '');

const escapeXml = (text) =>
  String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const toEntry = ({ path, lastmod, changefreq, priority }) =>
  [
    '  <url>',
    `    <loc>${escapeXml(`${getSiteUrl()}${path}`)}</loc>`,
    lastmod ? `    <lastmod>${new Date(lastmod).toISOString()}</lastmod>` : '',
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : '',
    priority ? `    <priority>${priority}</priority>` : '',
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n');

const buildSitemap = async () => {
  const staticEntries = [
    { path: '/', changefreq: 'daily', priority: '1.0' },
    { path: '/terms', changefreq: 'yearly', priority: '0.3' },
    ...POST_TYPES.map((type) => ({ path: `/?type=${type}`, changefreq: 'daily', priority: '0.8' })),
    ...COLLEGES.map((college) => ({ path: `/?college=${college}`, changefreq: 'daily', priority: '0.7' })),
  ];

  // Public profiles that have at least one approved post
  const authorIds = await Post.distinct('author', { status: 'approved' });
  const profiles = await User.find({ _id: { $in: authorIds } })
    .select('username updatedAt')
    .limit(MAX_URLS)
    .lean();
  const profileEntries = profiles.map(({ username, updatedAt }) => ({
    path: `/${username}`,
    lastmod: updatedAt,
    changefreq: 'weekly',
    priority: '0.6',
  }));

  // Defaults to /post/:id (matches PostDetailPage route); set SITEMAP_POST_PATH='' to disable
  const SITEMAP_POST_PATH = process.env.SITEMAP_POST_PATH ?? '/post/:id';
  let postEntries = [];
  if (SITEMAP_POST_PATH?.includes(':id')) {
    const posts = await Post.find({ status: 'approved' })
      .sort({ updatedAt: -1 })
      .select('_id updatedAt')
      .limit(MAX_URLS)
      .lean();
    postEntries = posts.map(({ _id, updatedAt }) => ({
      path: SITEMAP_POST_PATH.replace(':id', String(_id)),
      lastmod: updatedAt,
      changefreq: 'monthly',
      priority: '0.7',
    }));
  }

  const entries = [...staticEntries, ...profileEntries, ...postEntries].slice(0, MAX_URLS);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries
    .map(toEntry)
    .join('\n')}\n</urlset>\n`;
};

router.get('/sitemap.xml', async (req, res) => {
  try {
    if (!cache.xml || Date.now() - cache.builtAt > CACHE_MS) {
      cache = { xml: await buildSitemap(), builtAt: Date.now() };
    }
    res.set({ 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' });
    res.status(200).send(cache.xml);
  } catch (error) {
    res.status(500).type('text/plain').send(`Could not build sitemap: ${error.message}`);
  }
});

router.get('/robots.txt', (req, res) => {
  const lines = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /login',
    'Disallow: /register',
    'Disallow: /complete-profile',
    'Disallow: /create-post',
    '',
    `Sitemap: ${getSiteUrl()}/sitemap.xml`,
    '',
  ];
  res.set('Cache-Control', 'public, max-age=86400');
  res.type('text/plain').send(lines.join('\n'));
});

export default router;

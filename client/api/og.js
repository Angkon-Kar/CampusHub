// client/api/og.js  (Vercel serverless function)
// Link-preview bots (LinkedIn, Facebook, WhatsApp...) do not run JavaScript, so they would only see an empty
// page for /username and /post/:id. vercel.json sends those bots here, and we answer with real Open Graph tags.
// Normal visitors never reach this file: they get the React app.
//
// Vercel environment variable needed: API_BASE_URL = your Render server URL (no /api at the end).

const API_BASE = (process.env.API_BASE_URL || process.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

const SITE_NAME = 'Campus Hub';
const DEFAULT_DESCRIPTION =
  'Free suggestions, previous questions, slides, articles, courses and projects shared by students from six engineering colleges.';

const escapeHtml = (value = '') =>
  String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const stripTags = (html = '') =>
  String(html).replace(/<\/(p|div|li|h2|h3|blockquote|pre)>/gi, ' ').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

const fetchJson = async (path) => {
  if (!API_BASE) return null;
  try {
    const response = await fetch(`${API_BASE}${path}`, { signal: AbortSignal.timeout(8000) });
    return response.ok ? await response.json() : null;
  } catch {
    return null;
  }
};

export default async function handler(req, res) {
  const { username, post } = req.query;
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const origin = `https://${host}`;

  let title = SITE_NAME;
  let description = DEFAULT_DESCRIPTION;
  let path = '/';

  if (username) {
    const data = await fetchJson(`/api/profile/${encodeURIComponent(String(username))}`);
    if (data?.profile) {
      const { profile, achievements, posts = [] } = data;
      title = `${profile.fullName} (@${profile.username}) | ${SITE_NAME}`;
      description =
        profile.bio ||
        `${profile.college} · ${profile.department} · ${posts.length} approved posts and ${achievements?.unlockedBadges?.length || 0} achievements on ${SITE_NAME}.`;
      path = `/${profile.username}`;
    }
  } else if (post) {
    const data = await fetchJson(`/api/posts/${encodeURIComponent(String(post))}`);
    if (data?.post) {
      title = `${data.post.title} | ${SITE_NAME}`;
      description = stripTags(data.post.content).slice(0, 200) || DEFAULT_DESCRIPTION;
      path = `/post/${data.post._id}`;
    }
  }

  const url = `${origin}${path}`;
  const image = `${origin}/campushub.png`;

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${escapeHtml(url)}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${escapeHtml(url)}" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />
  </head>
  <body>
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(description)}</p>
    <p><a href="${escapeHtml(url)}">Open on ${SITE_NAME}</a></p>
  </body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  // Cached at Vercel's edge, so many shares do not wake the Render server again and again
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  res.status(200).send(html);
}
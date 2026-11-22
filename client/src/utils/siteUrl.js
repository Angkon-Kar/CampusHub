// client/src/utils/siteUrl.js
// Public address of the site (set VITE_SITE_URL in client/.env for production, e.g. https://campushub.vercel.app)
export const getSiteUrl = () => (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/+$/, '');

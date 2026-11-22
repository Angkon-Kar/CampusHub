// server/utils/linkKey.js
// Helpers that turn a link into a stable "key" (for duplicate detection) and into a safe preview URL.

const TRACKING_PARAMS = /^(utm_.+|fbclid|gclid|usp|ref|ref_src|si)$/i;
const FILE_ID = /^[\w-]{10,}$/;

// Returns the Google Drive / Docs file or folder id, or null for any other site.
// Handles /file/d/ID/view, /document/d/ID/edit, /folders/ID, /open?id=ID and /uc?id=ID.
export const extractGoogleFileId = (link) => {
  try {
    const { hostname, pathname, searchParams } = new URL(link);
    const host = hostname.toLowerCase();
    if (host !== 'drive.google.com' && host !== 'docs.google.com') return null;

    const match =
      pathname.match(/\/(?:file|document|presentation|spreadsheets|forms)\/d\/([\w-]+)/) ||
      pathname.match(/\/folders\/([\w-]+)/);
    const id = match?.[1] || searchParams.get('id');
    return id && FILE_ID.test(id) ? id : null;
  } catch {
    return null;
  }
};

// Two links that point to the same thing get the same key, even with different
// sharing parameters (?usp=sharing), tracking parameters, "www.", fragments or trailing slashes.
export const normalizeLinkKey = (link) => {
  try {
    const fileId = extractGoogleFileId(link);
    if (fileId) return `gdrive:${fileId}`;

    const url = new URL(link);
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    const params = [...url.searchParams.entries()]
      .filter(([key]) => !TRACKING_PARAMS.test(key))
      .sort(([a], [b]) => a.localeCompare(b));
    const search = params.length > 0 ? `?${new URLSearchParams(params).toString()}` : '';
    const path = url.pathname.replace(/\/+$/, '');
    return `${host}${path}${search}`;
  } catch {
    return String(link).trim().toLowerCase();
  }
};

// Embeddable preview URL for Drive/Docs FILES (folders have no preview). Returns null otherwise.
export const getPreviewUrl = (link) => {
  const id = extractGoogleFileId(link);
  if (!id) return null;

  try {
    const { hostname, pathname } = new URL(link);
    if (pathname.includes('/folders/')) return null;

    if (hostname.toLowerCase() === 'docs.google.com') {
      const kind = pathname.match(/\/(document|presentation|spreadsheets)\//)?.[1];
      return kind ? `https://docs.google.com/${kind}/d/${id}/preview` : null;
    }
    return `https://drive.google.com/file/d/${id}/preview`;
  } catch {
    return null;
  }
};

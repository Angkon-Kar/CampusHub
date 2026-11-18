// client/src/utils/sanitize.js
import DOMPurify from 'dompurify';

// Links in articles always open safely in a new tab
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

// Same tags the server allows (see sanitizeArticleContent in postRoutes.js)
export const sanitizeHtml = (dirty = '') =>
  DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'strong', 'i', 'em', 'u', 's', 'br', 'p', 'div', 'span', 'a', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOWED_URI_REGEXP: /^https:/i,
  });

// Plain text version, used to check that an article is not empty
export const stripHtml = (html = '') =>
  html
    .replace(/<\/(p|div|li|h2|h3|blockquote|pre)>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();
// client/src/components/Seo.jsx
// Sets the page title, description, canonical link, Open Graph / Twitter tags and optional JSON-LD structured data.
// Usage: <Seo title="Algorithms notes" description="..." path="/?type=resource" jsonLd={{...}} />
import { useEffect } from 'react';
import { getSiteUrl } from '../utils/siteUrl';

const SITE_NAME = 'Campus Hub';
const DEFAULT_TITLE = 'Campus Hub: free notes, slides and questions for engineering students';
const DEFAULT_DESCRIPTION =
  'Free suggestions, previous questions, slides, articles, courses and projects shared by students from six engineering colleges.';
const DEFAULT_IMAGE = '/og-image.png'; // put a 1200x630 image at client/public/og-image.png

const upsertTag = (selector, create) => {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = create();
    document.head.appendChild(element);
  }
  return element;
};

const setMeta = (attribute, key, content) => {
  const element = upsertTag(`meta[${attribute}="${key}"]`, () => {
    const meta = document.createElement('meta');
    meta.setAttribute(attribute, key);
    return meta;
  });
  element.setAttribute('content', content);
};

const setCanonical = (href) => {
  const element = upsertTag('link[rel="canonical"]', () => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    return link;
  });
  element.setAttribute('href', href);
};

export const Seo = ({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  image = DEFAULT_IMAGE,
  type = 'website',
  noIndex = false,
  jsonLd,
}) => {
  // Compare structured data by value, so a new object on every render does not re-run the effect
  const jsonLdText = jsonLd ? JSON.stringify(jsonLd) : '';

  useEffect(() => {
    const base = getSiteUrl();
    const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
    const url = `${base}${path ?? window.location.pathname}`;
    const imageUrl = image.startsWith('http') ? image : `${base}${image}`;

    document.title = fullTitle;
    setMeta('name', 'description', description);
    setMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow');
    setCanonical(url);

    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', imageUrl);

    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', imageUrl);

    let script = null;
    if (jsonLdText) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = jsonLdText;
      document.head.appendChild(script);
    }

    return () => script?.remove();
  }, [title, description, path, image, type, noIndex, jsonLdText]);

  return null;
};

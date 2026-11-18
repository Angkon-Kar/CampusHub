// client/src/hooks/useTabAttention.js
// When the visitor switches to another browser tab (or minimizes the window) and stays away
// for 5 seconds, the tab title and icon start blinking until they come back.
import { useEffect } from 'react';

const AWAY_DELAY_MS = 10000; // wait before the blinking starts
const BLINK_INTERVAL_MS = 10000; // one switch per second

// Alert icon drawn as an inline SVG, so no extra image file is needed
const ALERT_ICON =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
      '<rect width="64" height="64" rx="14" fill="#4f46e5"/>' +
      '<text x="32" y="46" font-size="40" font-weight="700" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif">!</text>' +
      '<circle cx="51" cy="13" r="10" fill="#f43f5e"/>' +
      '</svg>'
  );

const getFaviconHref = () => document.querySelector('link[rel~="icon"]')?.getAttribute('href') || '/favicon.ico';

// Replacing the <link> element (not only its href) makes every browser refresh the icon
const setFavicon = (href, type) => {
  document.querySelectorAll('link[rel~="icon"]').forEach((link) => link.remove());
  const link = document.createElement('link');
  link.rel = 'icon';
  if (type) link.type = type;
  link.href = href;
  document.head.appendChild(link);
};

export const useTabAttention = ({ message = '👋 Come back to Campus Hub!' } = {}) => {
  useEffect(() => {
    let awayTimer = null;
    let blinkTimer = null;
    let originalTitle = '';
    let originalIcon = '';
    let isBlinking = false;

    const startBlinking = () => {
      originalTitle = document.title;
      originalIcon = getFaviconHref();
      isBlinking = true;

      let showAlert = true;
      const tick = () => {
        document.title = showAlert ? message : originalTitle;
        if (showAlert) setFavicon(ALERT_ICON, 'image/svg+xml');
        else setFavicon(originalIcon);
        showAlert = !showAlert;
      };

      tick();
      blinkTimer = setInterval(tick, BLINK_INTERVAL_MS);
    };

    const stop = () => {
      clearTimeout(awayTimer);
      clearInterval(blinkTimer);
      awayTimer = null;
      blinkTimer = null;

      if (isBlinking) {
        document.title = originalTitle;
        setFavicon(originalIcon);
        isBlinking = false;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearTimeout(awayTimer);
        awayTimer = setTimeout(startBlinking, AWAY_DELAY_MS);
      } else {
        stop();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stop();
    };
  }, [message]);
};
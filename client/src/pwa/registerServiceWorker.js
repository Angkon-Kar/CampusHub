// client/src/pwa/registerServiceWorker.js
// Registers /sw.js in the production build only (in development it would cache old code and confuse you).
import toast from 'react-hot-toast';

export const registerServiceWorker = () => {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');

      // A new version was installed while the app was open
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            toast('A new version of Campus Hub is ready. Reload the page to update.', { duration: 10000, icon: '🔄' });
          }
        });
      });
    } catch (error) {
      console.warn('Service worker registration failed:', error);
    }
  });
};
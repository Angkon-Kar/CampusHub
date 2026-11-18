// client/public/sw.js  (service worker)
// - Pages: network first, so people always get the newest version when online. Offline: the last saved page, or offline.html.
// - Files in /assets and icons: served from cache, refreshed in the background.
// - API calls (your Render server) and other websites are never cached.
// Change VERSION when you change this file, so old caches are cleaned up.
const VERSION = 'v1';
const SHELL_CACHE = `campushub-shell-${VERSION}`;
const ASSET_CACHE = `campushub-assets-${VERSION}`;
const SHELL_URLS = ['/', '/offline.html', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(names.filter((name) => ![SHELL_CACHE, ASSET_CACHE].includes(name)).map((name) => caches.delete(name))))
      .then(() => self.clients.claim())
  );
});

const isStaticAsset = (url) =>
  url.pathname.startsWith('/assets/') ||
  url.pathname.startsWith('/icons/') ||
  /\.(?:js|css|woff2?|png|jpg|jpeg|svg|webp|ico)$/.test(url.pathname);

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // the API server and fonts are not handled here
  if (url.pathname.startsWith('/api/')) return;

  // Page navigation (every route of the single-page app returns index.html)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(SHELL_CACHE).then((cache) => cache.put('/', copy));
          }
          return response;
        })
        .catch(async () => (await caches.match('/')) || (await caches.match('/offline.html')))
    );
    return;
  }

  // Scripts, styles, images: cache first, update in the background
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.open(ASSET_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        const refresh = fetch(request)
          .then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          })
          .catch(() => cached);
        return cached || refresh;
      })
    );
  }
});
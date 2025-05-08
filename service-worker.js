const CACHE_NAME = 'crudit-cache-v3';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/scripts.js',
  '/style.css',
  '/manifest.json',
  '/images/192x192.webp',
  '/images/512x512.webp',
  'https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css'
];

// Installs event
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing... Cache version> ${CACHE_NAME}');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activates event and cleans up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activate with cache: ${CACHE_NAME}');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => {
          console.log('[Service Worker] Removing old cache:', key);
          return caches.delete(key);
        })
      );
    })
  );
});

// Fetches event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

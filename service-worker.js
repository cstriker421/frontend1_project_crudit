const CACHE_NAME = 'crudit-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/scripts.js',
    '/manifest.json',
    '/images/192x192.webp',
    '/images/512x512.webp'
];

// Installs the service worker and cache files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching files during install');
                return cache.addAll(urlsToCache);
            })
    );
});

// Activates the service worker and cleans up old caches
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetches cached files when offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse; // Serves from cache
                }
                return fetch(event.request); // Fetches from network
            })
    );
});

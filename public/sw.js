// Service Worker for TunisiaTrip
// Version 1.0.0

const CACHE_NAME = 'tunisiatrip-v1';
const DYNAMIC_CACHE = 'tunisiatrip-dynamic-v1';

// Assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/index.css',
  '/lovable-uploads/93c21f45-85e6-4c0d-9726-d7648d48686d.png', // favicon
  '/lovable-uploads/3caaa473-8150-4b29-88b4-e2e9c696bf1d.png', // hero image
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME && name !== DYNAMIC_CACHE)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip caching for:
  // - Chrome extensions
  // - API calls (except weather which can be cached briefly)
  // - Admin routes
  if (
    url.protocol === 'chrome-extension:' ||
    url.pathname.startsWith('/admin') ||
    url.hostname === 'localhost'
  ) {
    return;
  }

  // Cache strategy based on request type
  if (request.destination === 'image') {
    // Images: Cache first, fallback to network
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(request)
            .then((networkResponse) => {
              return caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                  cache.put(request, networkResponse.clone());
                  return networkResponse;
                });
            });
        })
    );
  } else if (
    request.destination === 'font' ||
    request.destination === 'style' ||
    request.destination === 'script'
  ) {
    // Fonts, CSS, JS: Cache first, fallback to network
    event.respondWith(
      caches.match(request)
        .then((response) => {
          return response || fetch(request)
            .then((networkResponse) => {
              return caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(request, networkResponse.clone());
                  return networkResponse;
                });
            });
        })
    );
  } else if (url.hostname === 'api.open-meteo.com') {
    // Weather API: Network first with 5-minute cache
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          const clonedResponse = networkResponse.clone();
          caches.open(DYNAMIC_CACHE)
            .then((cache) => {
              cache.put(request, clonedResponse);
            });
          return networkResponse;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
  } else {
    // HTML and other requests: Network first, fallback to cache
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          return caches.open(DYNAMIC_CACHE)
            .then((cache) => {
              if (request.method === 'GET') {
                cache.put(request, networkResponse.clone());
              }
              return networkResponse;
            });
        })
        .catch(() => {
          return caches.match(request);
        })
    );
  }
});

// Message event - for cache management
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys()
        .then((cacheNames) => {
          return Promise.all(
            cacheNames.map((name) => caches.delete(name))
          );
        })
        .then(() => {
          self.clients.matchAll().then((clients) => {
            clients.forEach((client) => {
              client.postMessage({ type: 'CACHE_CLEARED' });
            });
          });
        })
    );
  }
});

const CACHE_NAME = 'incomeos-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/style.css',
  '/js/app.js',
  '/js/web3.js'
];

// Install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch (offline support)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => 
      response || fetch(event.request).catch(() => caches.match('/offline.html'))
    )
  );
});

// Background sync
self.addEventListener('sync', event => {
  if (event.tag === 'sync-earnings') {
    event.waitUntil(syncEarnings());
  }
});

async function syncEarnings() {
  console.log('📶 Syncing offline earnings...');
  // Implementation when back online
}

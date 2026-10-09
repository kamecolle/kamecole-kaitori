// Service Worker - キャッシュを完全に無効化
self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(key) {
        return caches.delete(key);
      }));
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(e) {
  // キャッシュを使わず常にネットワークから取得
  e.respondWith(
    fetch(e.request, { cache: 'no-store' }).catch(function() {
      return caches.match(e.request);
    })
  );
});

// Service Worker v2 - 常にネットワーク優先
var VERSION = 'v2';

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
  var url = e.request.url;

  // GitHubのAPIやrawコンテンツは常にネットワークから
  if (url.includes('github') || url.includes('raw.githubusercontent')) {
    e.respondWith(fetch(e.request, { cache: 'no-store' }));
    return;
  }

  // HTMLファイルは常にネットワーク優先
  if (url.includes('.html') || url.endsWith('/')) {
    e.respondWith(
      fetch(e.request, { cache: 'no-store' }).catch(function() {
        return caches.match(e.request);
      })
    );
    return;
  }

  // その他も常にネットワーク優先
  e.respondWith(
    fetch(e.request, { cache: 'no-store' }).catch(function() {
      return caches.match(e.request);
    })
  );
});

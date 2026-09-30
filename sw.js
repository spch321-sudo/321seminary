/* 321學神院 Service Worker：網路優先，有新版就自動更新
   每次發布新版時，把下面的 VERSION 改成與 App 內 CONFIG.version 相同 */
var VERSION = '1.7.3';
var CACHE = 'xsy321-' + VERSION;

self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return c.addAll(['./', 'manifest.json', 'icon-192.png', 'icon-180.png']).catch(function () { });
  }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('message', function (e) { if (e.data === 'SKIP_WAITING') self.skipWaiting(); });

/* 網路優先：能連線就拿最新的並更新快取；離線時才用快取 */
self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(fetch(r, { cache: 'no-cache' }).then(function (res) {
    var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(r, copy); }); return res;
  }).catch(function () {
    return caches.match(r).then(function (m) { return m || caches.match('./'); });
  }));
});

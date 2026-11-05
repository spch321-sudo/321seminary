/* 321學神院 Service Worker：網路優先，有新版就自動更新
   每次發布新版時，把下面的 VERSION 改成與 App 內 CONFIG.version 相同 */
var VERSION = '1.9.1-k3m-vp1023-xz1103-xzm1103-rf1105';
var CACHE = 'xsy321-' + VERSION;
var SHELL_WAIT = 1000;

self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return c.addAll(['./', 'manifest.json', 'icon-192.png', 'icon-180.png', 'coread.js?v=1.9.1-xz1103-xzm1103-rf1105', 'peerjs.min.js', 'xk321.js?v=1.9.1-xz1103-xzm1103-rf1105', 'xz2.js?v=xz1103-rf1105', 'xzm.js?v=xzm1103']).catch(function () { });
  }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k.indexOf('xsy321-') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('message', function (e) { if (e.data === 'SKIP_WAITING' || e.data === 'skip') self.skipWaiting(); });

/* 網路優先：能連線就拿最新的並更新快取；離線時才用快取 */
self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  if (/version\.json$/.test(new URL(r.url).pathname)) {   /* 版本檔不走快取競速，免得慢網路時永遠看不到新版 */
    e.respondWith(fetch(r.url + '?t=' + Date.now(), { cache: 'no-store' })['catch'](function () { return new Response('{}', { headers: { 'Content-Type': 'application/json' } }); }));
    return;
  }
  var nav = r.mode === 'navigate';
  /* rf1105：網路優先，但慢網路（超過 1 秒還沒回）就先用快取開，網路那份繼續下載並更新快取；只有導覽請求才可退回首頁 */
  e.respondWith(new Promise(function (resolve) {
    var done = false, tm = null;
    function fromCache() { return caches.match(r, { ignoreSearch: true }).then(function (h) { return h || (nav ? caches.match('./') : null); }); }
    var net = fetch(r, { cache: 'no-cache' }).then(function (res) {
      if (res && res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(r, copy); }); }
      return res;
    });
    tm = setTimeout(function () { fromCache().then(function (h) { if (h && !done) { done = true; resolve(h); } }); }, SHELL_WAIT);
    net.then(function (res) { clearTimeout(tm); if (!done) { done = true; resolve(res); } }, function () {
      clearTimeout(tm); if (done) return;
      fromCache().then(function (h) { done = true; resolve(h || new Response('', { status: 504 })); });
    });
  }));
});

// Offline support: always ask the server first (skipping the phone's own short-term cache) so updates
// show up right away, and fall back to the last saved copy when there is no connection.
const CACHE = 'neofield-v2';
const CORE = ['./', 'index.html', 'engine.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameSite = url.origin === location.origin;
  const fonts = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!sameSite && !fonts) return;

  if (req.mode === 'navigate') {
    // a page load can't be re-sent with new options, so ask for the same address afresh
    e.respondWith(fetch(req.url, {cache: 'no-cache', credentials: 'same-origin'})
      .then(res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put('index.html', copy)); } return res; })
      .catch(() => caches.match('index.html')));
    return;
  }

  // fonts never change: cache first
  if (fonts) {
    e.respondWith(caches.open(CACHE).then(async c => (await c.match(req)) ||
      fetch(req).then(res => { c.put(req, res.clone()); return res; })));
    return;
  }
  // game files: ask the server first (unchanged files come back as a quick 'not modified'), saved copy when offline
  e.respondWith(fetch(req, {cache: 'no-cache'})
    .then(res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; })
    .catch(() => caches.match(req)));
});

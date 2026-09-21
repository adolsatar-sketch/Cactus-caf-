/* Tiny offline helper. Pages: network first (so price changes always show), assets: cache first (hashed filenames). */
const V = "cactus-cache-v1";
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(V).then((c) => c.add("/")).catch(() => {}).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});
self.addEventListener("fetch", (e) => {
  const r = e.request;
  if (r.method !== "GET") return;
  const u = new URL(r.url);
  if (u.origin !== location.origin) return;
  if (r.mode === "navigate") {
    e.respondWith(
      fetch(r)
        .then((res) => {
          const copy = res.clone();
          caches.open(V).then((c) => c.put(r, copy));
          return res;
        })
        .catch(() => caches.match(r).then((m) => m || caches.match("/"))),
    );
    return;
  }
  if (u.pathname.startsWith("/assets/") || /\.(png|svg|webp|jpg|jpeg|avif|ico|woff2)$/.test(u.pathname)) {
    e.respondWith(
      caches.match(r).then(
        (hit) =>
          hit ||
          fetch(r).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(V).then((c) => c.put(r, copy));
            }
            return res;
          }),
      ),
    );
  }
});

// Minimal service worker for installability + a graceful offline fallback.
// A real (non-empty) fetch handler that responds removes any doubt about
// Chrome's install criteria — an empty handler is borderline. Network-first,
// no aggressive caching (the menu changes often).
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  event.respondWith(fetch(request).catch(() => caches.match(request)));
});

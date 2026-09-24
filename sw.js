// เก็บเฉพาะหน้าแอปไว้เปิดเร็ว — ข้อมูลและ API ไม่ cache
const CACHE = "pricetag-v1";
const SHELL = ["./", "./index.html", "./config.js", "./manifest.json", "./icon-192.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;
  // network ก่อน (ได้เวอร์ชันล่าสุด) ถ้าออฟไลน์ค่อยใช้ cache
  e.respondWith(fetch(e.request).then((r) => { const c = r.clone(); caches.open(CACHE).then((x) => x.put(e.request, c)); return r; })
    .catch(() => caches.match(e.request)));
});

const CACHE_NAME = 'mines-pro-dynamic';
const assets = [
  './',
  './index.html',
  './manifest.json'
];

// Instalasi: Simpan aset dasar
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(assets))
  );
  self.skipWaiting(); // Paksa SW baru langsung aktif
});

// Strategi: Network First (Cek internet dulu, baru cache)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // Jika berhasil konek ke internet, update cache dengan file terbaru
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, response.clone());
          return response;
        });
      })
      .catch(() => {
        // Jika offline/internet mati, ambil dari cache
        return caches.match(e.request);
      })
  );
});

// Aktivasi: Bersihkan cache lama jika ada
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map(k => caches.delete(k)));
    })
  );
});

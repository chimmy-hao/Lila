const CACHE_NAME = 'lila-v2';
const assets = [
  '/Lila/',
  '/Lila/index.html',
  '/Lila/style.css',
  '/Lila/script.js',
  '/Lila/icono.png',
  '/Lila/manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(assets)));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
});
let alarmTime = null;

self.addEventListener('message', (event) => {
    if (event.data.type === 'SET_ALARM') {
        alarmTime = event.data.time;
    }
});

setInterval(() => {
    if (!alarmTime) return;
    
    const ahora = new Date();
    const actual = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;
    
    if (actual === alarmTime) {
        self.registration.showNotification("Lila", {
            body: "Es hora de tu Kirum 🌸",
            icon: "icon.jpg",
            badge: "icon.jpg",
            tag: "alarma-pastilla" // Evita que se dupliquen
        });
    }
}, 60000);

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

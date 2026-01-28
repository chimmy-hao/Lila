const CACHE_NAME = 'lila-v3';
// Solo los archivos esenciales. 
// Nota: Quitamos el prefijo /Lila/ para que funcione en la raíz de tu dominio de GitHub
const assets = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './icon.jpg',
  './manifest.json'
];

// Instalación y Cache
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(assets))
  );
  self.skipWaiting();
});

// Estrategia de red: Primero busca en internet, si falla usa el caché
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});

// --- LÓGICA DE ALARMAS ---
let alarmTime = null;

self.addEventListener('message', (event) => {
    if (event.data.type === 'SET_ALARM') {
        alarmTime = event.data.time;
        console.log("Alarma recibida en SW:", alarmTime);
    }
});

// El navegador intenta mantener vivo este intervalo
setInterval(() => {
    if (!alarmTime) return;
    
    const ahora = new Date();
    // Forzamos zona horaria de Argentina (Buenos Aires)
    const actual = ahora.toLocaleTimeString("es-AR", { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
    });
    
    if (actual === alarmTime) {
        self.registration.showNotification("Lila", {
            body: "Es hora de tu Kirum 🌸",
            icon: "icon.jpg", // Asegurate que sea .jpg como dijimos
            badge: "icon.jpg",
            tag: "alarma-pastilla",
            requireInteraction: true, // La notificación no se va sola
            vibrate: [200, 100, 200]
        });
    }
}, 60000);

// IjaraGo Service Worker — PWA Offline Support
const CACHE_NAME = 'IjaraGo-v2';
const OFFLINE_URL = '/offline.html';

// Files to cache for offline mode
const CACHE_URLS = [
    '/',
    '/index.html',
    '/listings.html',
    '/listing-detail.html',
    '/categories.html',
    '/how-it-works.html',
    '/faq.html',
    '/contact.html',
    '/login.html',
    '/register.html',
    '/user-panel.html',
    '/owner-panel.html',
    '/booking.html',
    '/add-listing.html',
    '/404.html',
    '/style.css',
    '/enhancements.css',
    '/main.js',
    '/data.js',
    '/auth.js',
    '/enhancements.js',
    '/widgets.js',
    '/listings-store.js',
    '/support-chat.js',
    '/manifest.json',
    '/offline.html',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap',
];

// ===== INSTALL =====
self.addEventListener('install', event => {
    console.log('[SW] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('[SW] Caching core files');
            return cache.addAll(CACHE_URLS.filter(url => !url.startsWith('http')));
        }).then(() => self.skipWaiting())
    );
});

// ===== ACTIVATE =====
self.addEventListener('activate', event => {
    console.log('[SW] Activating...');
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

// ===== FETCH =====
self.addEventListener('fetch', event => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) return cached;

            return fetch(event.request).then(response => {
                // Cache successful responses
                if (response && response.status === 200) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                }
                return response;
            }).catch(() => {
                // Offline fallback
                if (event.request.destination === 'document') {
                    return caches.match(OFFLINE_URL);
                }
            });
        })
    );
});

// ===== PUSH NOTIFICATIONS (simulated) =====
self.addEventListener('push', event => {
    const data = event.data?.json() || {
        title: 'IjaraGo',
        body: "Yangi bildirishnoma!",
        icon: '/icon-192.png'
    };

    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: data.icon || '/icon-192.png',
            badge: '/icon-192.png',
            tag: 'IjaraGo-notif',
            renotify: true,
            requireInteraction: false,
        })
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
});

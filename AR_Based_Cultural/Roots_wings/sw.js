/**
 * Service Worker for AR Cultural Heritage Platform
 * Provides offline functionality and caching for better performance
 */

const CACHE_NAME = 'heritage-platform-v1.0.0';
const STATIC_CACHE = 'heritage-static-v1';
const DYNAMIC_CACHE = 'heritage-dynamic-v1';

// Files to cache for offline functionality
const STATIC_FILES = [
    '/',
    '/index.html',
    '/explore.html',
    '/quiz.html',
    '/chatbot.html',
    '/contact.html',
    '/css/style.css',
    '/css/explore.css',
    '/css/quiz.css',
    '/css/chatbot.css',
    '/css/contact.css',
    '/js/main.js',
    '/js/explore.js',
    '/js/quiz.js',
    '/js/chatbot.js',
    '/js/contact.js',
    '/images/logo.png',
    '/images/favicon.ico',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
    'https://aframe.io/releases/1.4.0/aframe.min.js'
];

// Dynamic files that should be cached when accessed
const DYNAMIC_FILES = [
    '/images/',
    '/models/',
    'https://fonts.gstatic.com/'
];

// Install event - cache static files
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Service Worker: Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Service Worker: Static files cached successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Service Worker: Error caching static files', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated successfully');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve cached files or fetch from network
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension and other non-http requests
    if (!request.url.startsWith('http')) {
        return;
    }
    
    event.respondWith(
        caches.match(request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    console.log('Service Worker: Serving from cache', request.url);
                    return cachedResponse;
                }
                
                // Not in cache, fetch from network
                return fetch(request)
                    .then(networkResponse => {
                        // Check if we should cache this response
                        if (shouldCache(request.url)) {
                            const responseClone = networkResponse.clone();
                            caches.open(DYNAMIC_CACHE)
                                .then(cache => {
                                    console.log('Service Worker: Caching new resource', request.url);
                                    cache.put(request, responseClone);
                                });
                        }
                        
                        return networkResponse;
                    })
                    .catch(error => {
                        console.log('Service Worker: Network fetch failed', error);
                        
                        // Return offline fallback for HTML pages
                        if (request.headers.get('accept').includes('text/html')) {
                            return caches.match('/offline.html') || createOfflinePage();
                        }
                        
                        // Return placeholder for images
                        if (request.headers.get('accept').includes('image/')) {
                            return caches.match('/images/offline-placeholder.png') || createOfflineImage();
                        }
                        
                        throw error;
                    });
            })
    );
});

// Helper function to determine if a resource should be cached
function shouldCache(url) {
    // Cache images, fonts, and API responses
    const cacheableExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.woff', '.woff2', '.ttf'];
    const cacheableDomains = ['fonts.googleapis.com', 'fonts.gstatic.com'];
    
    return cacheableExtensions.some(ext => url.includes(ext)) ||
           cacheableDomains.some(domain => url.includes(domain)) ||
           url.includes('/api/') ||
           url.includes('/models/');
}

// Create offline fallback page
function createOfflinePage() {
    const offlineHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Offline - Roots & Wings</title>
            <style>
                body {
                    font-family: 'Poppins', sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    margin: 0;
                    background: linear-gradient(135deg, #FF9933, #0D47A1);
                    color: white;
                    text-align: center;
                    padding: 20px;
                }
                .offline-container {
                    max-width: 500px;
                    background: rgba(255, 255, 255, 0.1);
                    padding: 40px;
                    border-radius: 20px;
                    backdrop-filter: blur(10px);
                }
                .offline-icon {
                    font-size: 4rem;
                    margin-bottom: 20px;
                }
                h1 {
                    margin-bottom: 20px;
                    font-size: 2rem;
                }
                p {
                    margin-bottom: 30px;
                    line-height: 1.6;
                    opacity: 0.9;
                }
                .retry-btn {
                    background: #FF9933;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: background 0.3s ease;
                }
                .retry-btn:hover {
                    background: #FFB366;
                }
            </style>
        </head>
        <body>
            <div class="offline-container">
                <div class="offline-icon">📱</div>
                <h1>You're Offline</h1>
                <p>It looks like you're not connected to the internet. Some features may not be available, but you can still explore cached content.</p>
                <button class="retry-btn" onclick="window.location.reload()">Try Again</button>
            </div>
        </body>
        </html>
    `;
    
    return new Response(offlineHTML, {
        headers: { 'Content-Type': 'text/html' }
    });
}

// Create offline image placeholder
function createOfflineImage() {
    // Create a simple SVG placeholder
    const offlineSVG = `
        <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#f5f5f5"/>
            <text x="50%" y="50%" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="16" fill="#666">
                Image unavailable offline
            </text>
        </svg>
    `;
    
    return new Response(offlineSVG, {
        headers: { 'Content-Type': 'image/svg+xml' }
    });
}

// Background sync for form submissions
self.addEventListener('sync', event => {
    console.log('Service Worker: Background sync triggered', event.tag);
    
    if (event.tag === 'contact-form-sync') {
        event.waitUntil(syncContactForm());
    }
    
    if (event.tag === 'quiz-results-sync') {
        event.waitUntil(syncQuizResults());
    }
});

// Sync contact form submissions
async function syncContactForm() {
    try {
        const submissions = await getStoredSubmissions('contact-submissions-pending');
        
        for (const submission of submissions) {
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(submission)
                });
                
                if (response.ok) {
                    console.log('Service Worker: Contact form synced successfully');
                    await removeStoredSubmission('contact-submissions-pending', submission.id);
                }
            } catch (error) {
                console.error('Service Worker: Failed to sync contact form', error);
            }
        }
    } catch (error) {
        console.error('Service Worker: Error in contact form sync', error);
    }
}

// Sync quiz results
async function syncQuizResults() {
    try {
        const results = await getStoredSubmissions('quiz-results-pending');
        
        for (const result of results) {
            try {
                const response = await fetch('/api/quiz-results', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(result)
                });
                
                if (response.ok) {
                    console.log('Service Worker: Quiz results synced successfully');
                    await removeStoredSubmission('quiz-results-pending', result.id);
                }
            } catch (error) {
                console.error('Service Worker: Failed to sync quiz results', error);
            }
        }
    } catch (error) {
        console.error('Service Worker: Error in quiz results sync', error);
    }
}

// Helper functions for background sync
async function getStoredSubmissions(storeName) {
    return new Promise((resolve, reject) => {
        const stored = localStorage.getItem(storeName);
        resolve(stored ? JSON.parse(stored) : []);
    });
}

async function removeStoredSubmission(storeName, submissionId) {
    return new Promise((resolve, reject) => {
        const stored = JSON.parse(localStorage.getItem(storeName) || '[]');
        const filtered = stored.filter(item => item.id !== submissionId);
        localStorage.setItem(storeName, JSON.stringify(filtered));
        resolve();
    });
}

// Push notification handling
self.addEventListener('push', event => {
    console.log('Service Worker: Push notification received');
    
    const options = {
        body: 'Discover new heritage sites and cultural experiences!',
        icon: '/images/logo.png',
        badge: '/images/badge.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Explore Now',
                icon: '/images/explore-icon.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/images/close-icon.png'
            }
        ]
    };
    
    if (event.data) {
        const payload = event.data.json();
        options.body = payload.body || options.body;
        options.title = payload.title || 'Roots & Wings';
    }
    
    event.waitUntil(
        self.registration.showNotification('Roots & Wings', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
    console.log('Service Worker: Notification clicked', event.action);
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/explore.html')
        );
    } else if (event.action === 'close') {
        // Just close the notification
        return;
    } else {
        // Default action - open the app
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Message handling from main thread
self.addEventListener('message', event => {
    console.log('Service Worker: Message received', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
    
    if (event.data && event.data.type === 'CACHE_URLS') {
        event.waitUntil(
            caches.open(DYNAMIC_CACHE)
                .then(cache => cache.addAll(event.data.urls))
        );
    }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', event => {
    console.log('Service Worker: Periodic sync triggered', event.tag);
    
    if (event.tag === 'heritage-content-update') {
        event.waitUntil(updateHeritageContent());
    }
});

// Update heritage content in background
async function updateHeritageContent() {
    try {
        const response = await fetch('/api/heritage-updates');
        if (response.ok) {
            const updates = await response.json();
            
            // Cache new content
            const cache = await caches.open(DYNAMIC_CACHE);
            for (const update of updates) {
                if (update.url) {
                    await cache.add(update.url);
                }
            }
            
            console.log('Service Worker: Heritage content updated');
        }
    } catch (error) {
        console.error('Service Worker: Failed to update heritage content', error);
    }
}

// Error handling
self.addEventListener('error', event => {
    console.error('Service Worker: Global error', event.error);
});

self.addEventListener('unhandledrejection', event => {
    console.error('Service Worker: Unhandled promise rejection', event.reason);
});

console.log('Service Worker: Loaded successfully');

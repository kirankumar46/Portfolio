const CACHE_NAME = 'kiran-portfolio-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/css/styles.css',
  '/assets/js/main.js',
  '/assets/img/perfil.png',
  '/assets/img/about.jpg',
  '/assets/img/work3.jpg',
  '/assets/img/chat.png',
  '/assets/img/todo.png',
  '/assets/img/quiz.png',
  '/assets/img/matrica.jpg',
  '/assets/img/nitk.jpg',
  '/assets/Kiran Resume.pdf',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/boxicons@2.0.5/css/boxicons.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css',
  'https://unpkg.com/scrollreveal'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.log('Cache install failed:', error);
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        
        // Clone the request because it's a stream
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response because it's a stream
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        }).catch(() => {
          // Return offline page for navigation requests
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form') {
    event.waitUntil(
      // Handle offline form submissions here
      console.log('Background sync triggered')
    );
  }
});

// Push notification handler
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/assets/img/icon-192.png',
    badge: '/assets/img/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Portfolio',
        icon: '/assets/img/icon-192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/img/icon-192.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Kiran Portfolio', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
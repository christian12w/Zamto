// Service worker for offline functionality
const CACHE_NAME = 'zamto-africa-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/css/main.css',
  '/static/js/main.js'
];

// Additional cache for API responses
const API_CACHE_NAME = 'zamto-africa-api-v1';
const VEHICLE_CACHE_NAME = 'zamto-africa-vehicles-v1';

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  // Handle API requests separately
  if (event.request.url.includes('/api/vehicles')) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Return cached version if available
          if (response) {
            // Also try to fetch fresh data in background
            fetch(event.request)
              .then((freshResponse) => {
                // Update cache with fresh data
                caches.open(VEHICLE_CACHE_NAME)
                  .then((cache) => {
                    cache.put(event.request, freshResponse.clone());
                  });
              })
              .catch(() => {
                // Network error, but we still have cached data
                console.log('Network error, serving cached data');
              });
            
            return response;
          }
          
          // Try to fetch from network
          return fetch(event.request).then((response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response because it's a stream that can only be consumed once
            const responseToCache = response.clone();
            
            // Cache the response for future offline use
            caches.open(VEHICLE_CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          });
        })
    );
    return;
  }
  
  // Handle other requests (assets, pages, etc.)
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response;
        }
        
        // Clone the request because it's a stream that can only be consumed once
        const fetchRequest = event.request.clone();
        
        // Try to fetch from network
        return fetch(fetchRequest).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response because it's a stream that can only be consumed once
          const responseToCache = response.clone();
          
          // Cache the response for future offline use
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
            
          return response;
        });
      })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME, API_CACHE_NAME, VEHICLE_CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Message event - handle cache updates from the main app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_VEHICLES') {
    // Cache vehicles data sent from the main app
    caches.open(VEHICLE_CACHE_NAME)
      .then((cache) => {
        const vehiclesResponse = new Response(JSON.stringify(event.data.vehicles), {
          headers: { 'Content-Type': 'application/json' }
        });
        cache.put('/api/vehicles', vehiclesResponse);
        console.log('Vehicles cached from main app message');
      });
  }
});
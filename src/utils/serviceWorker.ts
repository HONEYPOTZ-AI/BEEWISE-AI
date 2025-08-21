import { logger } from './logger';

export function registerServiceWorker() {
  if ('serviceWorker' in navigator && import.meta.env.VITE_APP_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          logger.info('ServiceWorker registered successfully', {
            scope: registration.scope
          });

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (!newWorker) return;

            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                logger.info('New content is available; please refresh.');
                
                // Notify user about the update
                if (window.confirm('New version available! Reload to update?')) {
                  window.location.reload();
                }
              }
            });
          });
        })
        .catch(error => {
          logger.error('Error during service worker registration:', error);
        });

      // Handle updates when the user returns to the app
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
      });
    });
  } else {
    logger.info('ServiceWorker is not supported or disabled in this environment');
  }
}

export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
        logger.info('ServiceWorker unregistered');
      })
      .catch(error => {
        logger.error('Error unregistering service worker:', error);
      });
  }
}

// Function to check for service worker updates
export function checkForUpdates() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.update();
        logger.info('Checking for ServiceWorker updates');
      })
      .catch(error => {
        logger.error('Error checking for updates:', error);
      });
  }
}

// Handle service worker messages
export function setupServiceWorkerMessages() {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      const data = event.data;
      
      // Handle different message types
      switch (data.type) {
        case 'CACHE_UPDATED':
          logger.info('Cache updated:', data.url);
          break;
        case 'ERROR':
          logger.error('Service worker error:', data.error);
          break;
        default:
          logger.debug('Service worker message:', data);
      }
    });
  }
}

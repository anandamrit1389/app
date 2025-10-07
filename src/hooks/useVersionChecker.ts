import { useEffect } from 'react';

const CURRENT_VERSION = import.meta.env.VITE_APP_VERSION;

export const useVersionChecker = () => {
  useEffect(() => {
    if (!['dev', 'stage', 'prod'].includes(import.meta.env.VITE_NODE_ENV)) return;

    console.log('version:', CURRENT_VERSION);

    let controllerChanged = false;

    const checkVersion = async () => {
      if (document.visibilityState === 'hidden') return;
      try {
        const res = await fetch('/meta.json', { cache: 'no-cache' });
        const data = await res.json();
        if (data.version !== CURRENT_VERSION) {
          if (navigator.serviceWorker?.controller) {
            navigator.serviceWorker.getRegistrations().then((registrations) => {
              registrations.forEach((registration) => {
                registration.update();
              });
            });
          }
          if (!controllerChanged) {
            navigator.serviceWorker?.addEventListener('controllerchange', () => {
              controllerChanged = true;
              window.location.reload();
            });
          }
        }
      } catch (err) {
        console.warn('Version check failed:', err);
      }
    };

    const interval = setInterval(checkVersion, 60000);
    return () => clearInterval(interval);
  }, []);
};

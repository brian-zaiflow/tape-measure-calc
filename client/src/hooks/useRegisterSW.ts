import { useEffect, useState } from 'react';
import { useRegisterSW as useVitePWA } from 'virtual:pwa-register/react';

export function useRegisterSW() {
  const [needRefresh, setNeedRefresh] = useState(false);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefreshVite, setNeedRefreshVite],
    updateServiceWorker,
  } = useVitePWA({
    onRegistered(r) {
      console.log('SW Registered:', r);
      // Check for updates every hour
      r && setInterval(() => {
        r.update();
      }, 60 * 60 * 1000);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  useEffect(() => {
    setNeedRefresh(needRefreshVite);
  }, [needRefreshVite]);

  const close = () => {
    setOfflineReady(false);
    setNeedRefreshVite(false);
    setNeedRefresh(false);
  };

  const updateApp = () => {
    updateServiceWorker(true);
  };

  return {
    offlineReady,
    needRefresh,
    updateApp,
    close,
  };
}

import {
  getAccessTokenFromStorage,
  getTrackingConfig,
  setTrackingPayload,
} from '@/helpers/utils/storage';
import { sendStoredTrackingIfExists } from '@/helpers/utils/tracking.utils';
import { TrackingConfig } from '@/interfaces/trackingPayload.interface';
import { useEffect } from 'react';

const localConfig: TrackingConfig = {
  ttclid: { name: 'tiktok', enabled: true },
  fbclid: { name: 'meta', enabled: true },
  li_fat_id: { name: 'linkedin', enabled: true },
  gclid: { name: 'google', enabled: true },
  msclkid: { name: 'bing', enabled: false },
};

export const useTrackingIdHandler = () => {
  const handleTracking = async () => {
    const params = new URLSearchParams(window.location.search);
    const config = import.meta.env.VITE_NODE_ENV === 'local' ? localConfig : getTrackingConfig();
    if (config === null) {
      return;
    }

    let trackingId: string | null = null;
    let trackingType: string | null = null;

    for (const param in config) {
      const value = params.get(param);
      if (value && config[param].enabled) {
        trackingId = value;
        trackingType = config[param].name;
        break;
      }
    }

    if (!trackingId || !trackingType) return;
    const tokenId = getAccessTokenFromStorage();

    setTrackingPayload({
      trackingId,
      trackingType,
      timestamp: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    if (tokenId) {
      await sendStoredTrackingIfExists();
    }
  };

  useEffect(() => {
    handleTracking();
  }, []);
};

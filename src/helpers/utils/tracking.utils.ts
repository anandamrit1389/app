import ConversionTrackingService from '@/api/conversionTrackingService';
import { getTrackingPayload, removeTrackingPayload } from './storage';
import { getCookieConsentFromStorage } from '@/features/cookie-consent';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export const sendStoredTrackingIfExists = async (): Promise<void> => {
  const trackingPayload = getTrackingPayload();
  const cookieConsent = getCookieConsentFromStorage();
  if (!trackingPayload) return;

  if (!cookieConsent || !cookieConsent?.targeting) return;

  const createdAt = new Date(trackingPayload.timestamp);
  const now = new Date();

  if (now.getTime() - createdAt.getTime() > THIRTY_DAYS_MS) {
    removeTrackingPayload();
    return;
  }
  try {
    await ConversionTrackingService.saveTrakingId(trackingPayload);
    removeTrackingPayload();
  } catch (error) {
    console.error('Failed to send stored tracking ID:', error);
  }
};

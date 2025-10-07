import apiService from '@/api/apiService';

export interface CookieConsent {
  cookiePreferences: {
    [key: string]: boolean;
  };
  source?: 'gtm' | 'modal' | 'manual';
}

export default class CookieConsentService {
  static saveCookieConsent(payload: CookieConsent): void {
    apiService
      .post('/cookie-consent', payload)
      .then((res) => res.data)
      .catch((err) => console.error(err));
  }
}

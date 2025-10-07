import { CookieConsentValue } from '../types';

const STORAGE_KEY = 'cookieConsent';

export function getCookieConsentFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
}

export function setCookieConsentToStorage(cookieConsent: CookieConsentValue) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cookieConsent));
  } catch {
    /* empty */
  }
}

import { useContext } from 'react';
import { CookieConsentContext } from '../context/CookieConsentProvider';

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CompanyProvider');
  }
  return context;
};

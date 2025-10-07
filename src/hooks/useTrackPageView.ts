import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analyticsService } from '@/helpers/services/AnalyticsService';
import { useCookieConsent } from '@/features/cookie-consent';

export const useTrackPageView = () => {
  const location = useLocation();
  const { consent } = useCookieConsent();
  const hasConsent = consent?.performance || consent?.targeting;

  useEffect(() => {
    if (!hasConsent) return;

    const pagePath = location.pathname + location.search;
    analyticsService.trackPageView(pagePath);
    
    const startTime = performance.now();
    const pageName = location.pathname.split('/').pop() || 'home';
    
    window.addEventListener('load', () => {
      const loadTime = Math.round(performance.now() - startTime);
      analyticsService.trackPageLoadTime(pageName, loadTime);
    });
  }, [location, hasConsent]);
};

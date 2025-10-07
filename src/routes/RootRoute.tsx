import useLocale from '@/hooks/useLocale';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTrackPageView } from '@/hooks/useTrackPageView';
import { CookieConsentProvider } from '@/features/cookie-consent';

const trackingId = import.meta.env.VITE_GTM_ID;
const env = import.meta.env.VITE_NODE_ENV;

const RootRoute = () => {
  useLocale();
  useTrackPageView();

  return (
    <CookieConsentProvider>
      {env === 'prod' && (
        <Helmet>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}></script>
          <script>
            {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${trackingId}');
        `}
          </script>
        </Helmet>
      )}
      <Outlet />
    </CookieConsentProvider>
  );
};

export default RootRoute;

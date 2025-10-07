import { Helmet } from 'react-helmet-async';
import { useCookieConsent } from '../hooks/useCookieConsent';

export const GtmScriptInjector = ({ gtmId }: { gtmId: string }) => {
  const { consent } = useCookieConsent();

  if (!consent?.targeting) return null;

  return (
    <Helmet>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${gtmId}`}></script>
      <script>
        {`
           (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
          `}
      </script>
    </Helmet>
  );
};

import AuthService from '@/api/authService';
import LocaleNavigate from '@/components/Locales/LocaleNavigate/LocaleNavigate';
import { AuthContext } from '@/providers/auth.provider';
import NotificationsProvider from '@/providers/notifications.provider';
import Loader from '@/assets/loader-color.svg?react';
import { useContext, useEffect, useState } from 'react';
import CompanyService from '@/api/companyService';
import { CookieConsentValue, useCookieConsent } from '@/features/cookie-consent';
import { sendStoredTrackingIfExists } from '@/helpers/utils/tracking.utils';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user, handleUserInfo, handleMembeshipInfo } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const { onSyncCookieConsent } = useCookieConsent();

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        const response = await AuthService.getProfile();
        const membershipInfo = await CompanyService.getCompanyMembershipInfo();
        handleMembeshipInfo(membershipInfo);
        onSyncCookieConsent(
          response?.data?.cookiePreferences
            ? (response.data?.cookiePreferences as unknown as CookieConsentValue)
            : null,
        );

        await sendStoredTrackingIfExists();
        handleUserInfo({
          user: response.data,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  if (loading)
    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loader className="size-16 animate-spin" />
      </div>
    );
  if (!user) return <LocaleNavigate to="/" />;

  return <NotificationsProvider>{children}</NotificationsProvider>;
};

export default PrivateRoute;

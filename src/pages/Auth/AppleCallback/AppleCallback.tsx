import { useContext, useEffect } from 'react';
import AuthService from '@/api/authService';
import {
  removeRegistrationIdFrmoStorage,
  setAccessTokenToStorage,
  setRefreshTokenToStorage,
  setUserInfoToStorage,
} from '@/helpers/utils/storage';
import { toast } from 'sonner';
import Loader from '@/assets/loader-color.svg?react';
import { AuthContext } from '@/providers/auth.provider';
import { useTranslation } from 'react-i18next';
import useLocaleNavigate from '@/hooks/useLocaleNavigate';
import LocaleNavigate from '@/components/Locales/LocaleNavigate/LocaleNavigate';
import { useSubscriptionModal } from '@/hooks/useSubscriptionModal';

const AppleCallback = () => {
  const navigate = useLocaleNavigate();
  const { onOpenChange } = useSubscriptionModal();

  const { accessToken, handleUserInfo } = useContext(AuthContext);
  const { t } = useTranslation('translation', { keyPrefix: 'auth' });

  useEffect(() => {
    const fetchData = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      if (code) {
        try {
          const response = await AuthService.oauthLogin(code, 'apple');
          const {
            data: { user, accessToken, refreshToken },
          } = response;

          setAccessTokenToStorage(accessToken);
          setRefreshTokenToStorage(refreshToken);
          setUserInfoToStorage(user);

          handleUserInfo({ user, accessToken });

          toast.success(t('successLogin'));
          removeRegistrationIdFrmoStorage();
          navigate('/dashboard');
          if (!user.subscription?.activeSubscription) {
            onOpenChange();
          }
        } catch (error) {
          toast.error(t('errorDefault'));
          navigate('/login');
          console.error('Error logging in with Google', error);
        }
      }
    };

    fetchData();
  }, []);

  if (accessToken) {
    return <LocaleNavigate to="/dashboard" />;
  }

  return (
    <div className="flex size-full items-center justify-center">
      <Loader className="size-16 animate-spin" />
    </div>
  );
};

export default AppleCallback;

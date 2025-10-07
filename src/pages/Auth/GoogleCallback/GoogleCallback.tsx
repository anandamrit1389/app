import { useContext, useEffect } from 'react';
import AuthService from '@/api/authService';
import {
  getInviteTokenFromStorage,
  getRegistrationIdFromStorage,
  removeRegistrationIdFrmoStorage,
  setAccessTokenToStorage,
  setRefreshTokenToStorage,
  setUserInfoToStorage,
  getSelectedPricingPlan,
  removeSelectedPricingPlan,
} from '@/helpers/utils/storage';
import { toast } from 'sonner';
import Loader from '@/assets/loader-color.svg?react';
import { AuthContext } from '@/providers/auth.provider';
import { useTranslation } from 'react-i18next';
import useLocaleNavigate from '@/hooks/useLocaleNavigate';
import LocaleNavigate from '@/components/Locales/LocaleNavigate/LocaleNavigate';
import { ApiError } from '@/interfaces/api.interface';
import { useSubscriptionModal } from '@/hooks/useSubscriptionModal';
import subscriptionService from '@/api/subscriptionService';

const GoogleCallback = () => {
  const navigate = useLocaleNavigate();
  const { accessToken, handleUserInfo } = useContext(AuthContext);
  const { t, i18n } = useTranslation('translation', { keyPrefix: 'auth' });
  const { onOpenChange } = useSubscriptionModal();

  useEffect(() => {
    const fetchData = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const returnedState = params.get('state');
      const originalState = sessionStorage.getItem('oauth_state');

      const inviteToken = await getInviteTokenFromStorage();
      const registrationId = getRegistrationIdFromStorage();

      if (!code || !returnedState || returnedState !== originalState) {
        navigate('/login');
        return;
      }

      try {
        const response = await AuthService.oauthLogin(
          code,
          'google',
          inviteToken,
          '',
          registrationId,
        );
        const {
          data: { user, accessToken, refreshToken },
        } = response;

        setAccessTokenToStorage(accessToken);
        setRefreshTokenToStorage(refreshToken);
        setUserInfoToStorage(user);

        handleUserInfo({ user, accessToken });

        toast.success(t('successLogin'));
        removeRegistrationIdFrmoStorage();

        const selectedPlan = getSelectedPricingPlan();
        if (selectedPlan) {
          try {
            const res = await subscriptionService.userSubscribe(
              selectedPlan.priceId, 
              selectedPlan.seats, 
              i18n.language
            );
            removeSelectedPricingPlan();
            window.location.href = res.url;
            return;
          } catch (error) {
            console.error('Error subscribing to plan:', error);
          }
        }

        navigate('/dashboard');
        if (!user.subscription?.activeSubscription) {
          onOpenChange();
        }
      } catch (error) {
        const apiError = error as ApiError;

        if (apiError.response?.status === 409) {
          toast.error(t('errorUserExistsWithPassword'));
        } else if (apiError.response?.data?.message) {
          toast.error(apiError.response.data.message);
        } else {
          toast.error(t('errorDefault'));
        }
        navigate('/login');
        console.error('Error logging in with Google', error);
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

export default GoogleCallback;

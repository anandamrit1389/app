import InabitLogo from '@/assets/logo-inabit-color.svg?react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import AuthService from '@/api/authService';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '@/contexts/User.context';
import { Button } from '@/components/ui/button';
import {
  removeRegistrationIdFrmoStorage,
  setAccessTokenToStorage,
  setRefreshTokenToStorage,
  setUserInfoToStorage,
} from '@/helpers/utils/storage';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import Loader from '@/assets/loader-color.svg?react';
import { AuthContext } from '@/providers/auth.provider';
import { Trans, useTranslation } from 'react-i18next';
import useLocaleNavigate from '@/hooks/useLocaleNavigate';
import LocaleLink from '@/components/Locales/LocaleLink/LocaleLink';
import LocaleNavigate from '@/components/Locales/LocaleNavigate/LocaleNavigate';
import { useSubscriptionModal } from '@/hooks/useSubscriptionModal';

const VerifyForm = () => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { onOpenChange } = useSubscriptionModal();

  const { t } = useTranslation('translation', { keyPrefix: 'auth' });

  const navigate = useLocaleNavigate();

  const { tempUser } = useContext(UserContext);
  const { handleUserInfo } = useContext(AuthContext);

  const handleChange = (value: string) => {
    setCode(value);
  };

  const handleResendCode = async () => {
    try {
      await AuthService.resend(tempUser.email ?? '');
      toast.success(t('successVerifyCodeMessage'));
    } catch (error) {
      toast.error(t('errorDefault'));
      console.error(error);
    }
  };

  useEffect(() => {
    const handleSubmit = async () => {
      if (tempUser.email === '' || tempUser.password === '') {
        navigate('/login');
        return;
      }

      try {
        setIsLoading(true);

        const {
          data: { accessToken, refreshToken, user },
        } = await AuthService.verify({
          code,
          email: tempUser.email,
          password: tempUser.password,
        });

        setAccessTokenToStorage(accessToken);
        setRefreshTokenToStorage(refreshToken);
        setUserInfoToStorage(user);

        handleUserInfo({ user, accessToken });

        toast.success(t('successVerifyMessage'));
        removeRegistrationIdFrmoStorage();

        navigate('/dashboard');

        if (!user.subscription?.activeSubscription) {
          onOpenChange();
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          if (
            error.response?.data?.message ===
            'Invalid verification code provided, please try again.'
          ) {
            toast.error(t('errorVerifyCodeMessage'));
          }
        }
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (code && code.length === 6) {
      handleSubmit();
    }
  }, [code]);

  if (!tempUser.email || !tempUser.password) {
    return <LocaleNavigate to="/login" />;
  }

  const handleRedirect = (route: string) => {
    navigate(route);
  };

  return (
    <div className="w-[464px] max-w-full rounded-lg bg-white px-10 py-8">
      {/* Header */}
      <div className="mb-[96px] flex flex-col items-center gap-8">
        <InabitLogo onClick={() => handleRedirect('/')} className="cursor-pointer" />
        <p className="font-inter mx-auto max-w-[314px] text-center text-sm text-darkText">
          {t('verifyFormText')}
        </p>
      </div>

      {/* Verify Inputs */}
      <h5 className="font-inter text-center text-base font-semibold text-darkText">
        {t('verifyFormTitle')}
      </h5>

      {/* Sign Up Form */}
      <div className="flex flex-col gap-[10px] pb-8 pt-6">
        <InputOTP maxLength={6} value={code} onChange={handleChange} disabled={isLoading}>
          <InputOTPGroup>
            <InputOTPSlot index={0} className="h-[64px] w-[48px] text-2xl" />
          </InputOTPGroup>

          <InputOTPGroup>
            <InputOTPSlot index={1} className="h-[64px] w-[48px] text-2xl" />
          </InputOTPGroup>

          <InputOTPGroup>
            <InputOTPSlot index={2} className="h-[64px] w-[48px] text-2xl" />
          </InputOTPGroup>

          <InputOTPGroup>
            <InputOTPSlot index={3} className="h-[64px] w-[48px] text-2xl" />
          </InputOTPGroup>

          <InputOTPGroup>
            <InputOTPSlot index={4} className="h-[64px] w-[48px] text-2xl" />
          </InputOTPGroup>

          <InputOTPGroup>
            <InputOTPSlot index={5} className="h-[64px] w-[48px] text-2xl" />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="text-inter flex h-[152px] items-center justify-center text-sm">
        {isLoading ? <Loader className="animate-spin" /> : ''}
      </div>

      {/* Footer */}
      <div className="flex flex-col items-center gap-8 text-center">
        <h5 className="font-inter text-xs font-semibold text-black">
          {t('codeRecieved')}{' '}
          <Button
            variant="link"
            className="p-0 text-xs text-[#FF3163] underline"
            onClick={handleResendCode}
          >
            {t('sendCodeAgain')}
          </Button>
        </h5>
        <p className="max-w-[310px] text-xs text-darkText">
          <Trans i18nKey="auth.agreeText1">
            By continuing, you agree to our
            <LocaleLink className="underline" to="/terms-of-use">
              Terms
            </LocaleLink>
          </Trans>
          <Trans i18nKey="auth.agreeText2">
            and acknowledge that you have read our
            <LocaleLink className="underline" to="/privacy-policy">
              Privacy Policy
            </LocaleLink>
          </Trans>
        </p>
      </div>
    </div>
  );
};

export default VerifyForm;

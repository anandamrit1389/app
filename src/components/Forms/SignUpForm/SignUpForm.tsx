import Divider from '@/components/CustomUI/Divider/Divider';
import { AppleLoginResponse, SignUpCredentials } from '@/interfaces/auth.interface';
import { createSignUpSchema } from '@/schemas/auth.schema';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InabitLogo from '@/assets/logo-inabit-color.svg?react';
import GoogleIcon from '@/assets/google-color.svg?react';
import AppleIcon from '@/assets/apple-light.svg?react';
import EyeIcon from '@/assets/eye.svg?react';
import CloseEyeIcon from '@/assets/close-eye.svg?react';
import { Input } from '@/components/ui/input';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { useContext, useEffect, useState } from 'react';
import ErrorText from '@/components/CustomUI/ErrorText/ErrorText';
import AuthService from '@/api/authService';
import { UserContext } from '@/contexts/User.context';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { handleLoginWithGoogle, handleLoginWithMicrosoft } from '@/helpers/auth.helper';
import AppleSignInButton from 'react-apple-signin-auth';
import { appleOptions } from '@/helpers/constants/auth.const';
import {
  getInviteTokenFromStorage,
  getRegistrationIdFromStorage,
  removeRegistrationIdFrmoStorage,
  setAccessTokenToStorage,
  setRefreshTokenToStorage,
  setUserInfoToStorage,
} from '@/helpers/utils/storage';
import { AuthContext } from '@/providers/auth.provider';
import { Trans, useTranslation } from 'react-i18next';
import useLocaleNavigate from '@/hooks/useLocaleNavigate';
import LocaleLink from '@/components/Locales/LocaleLink/LocaleLink';
import { useSubscriptionModal } from '@/hooks/useSubscriptionModal';
import { analyticsService } from '@/helpers/services/AnalyticsService';
import MicrosoftIcon from '@/assets/microsoft.svg?react';

const SignUpForm = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'auth' });
  const { onOpenChange } = useSubscriptionModal();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    watch,
  } = useForm<SignUpCredentials>({
    resolver: zodResolver(createSignUpSchema(t)),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const navigate = useLocaleNavigate();
  const { handleUpdateTempUser } = useContext(UserContext);
  const { handleUserInfo } = useContext(AuthContext);

  const confirmPassword = watch('confirmPassword');
  const password = watch('password');

  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState<boolean>(false);
  const handleTogglePassword = () => setIsShowPassword((prev) => !prev);
  const handleToggleConfirmPassword = () => setIsShowConfirmPassword((prev) => !prev);
  const [isPasswordMatch, setIsPasswordMatch] = useState<boolean>(true);

  const onSubmit: SubmitHandler<SignUpCredentials> = async (data) => {
    try {
      const inviteToken = await getInviteTokenFromStorage();
      const registrationId = getRegistrationIdFromStorage();

      const response = await AuthService.signup(data, inviteToken, registrationId);
      handleUpdateTempUser(data);
      analyticsService.trackAccountCreation(response.data.id);
      navigate('/verify');
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data?.message === 'User already exists') {
          toast.error(t('errorMessageUserExists'));
        } else {
          toast.error(error.response?.data?.message ?? t('errorDefault'));
        }
      }
      console.error(error);
    }
  };

  useEffect(() => {
    if (confirmPassword !== undefined && password !== undefined && confirmPassword !== '') {
      setIsPasswordMatch(password === confirmPassword);
    }
  }, [confirmPassword, password]);

  // TODO: Implement custom hook for Apple login
  const handleAppleLoginError = (error: Error) => {
    toast.error(error?.message ?? t('errorDefault'));
    console.error('Apple login error', error);
  };

  const handleAppleLoginSuccess = async (response: AppleLoginResponse) => {
    const { code } = response.authorization;

    try {
      const inviteToken = await getInviteTokenFromStorage();

      const {
        data: { accessToken, refreshToken, user },
      } = await AuthService.oauthLogin(code, 'apple', inviteToken);

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
      if (error instanceof AxiosError) {
        navigate('/login');
        toast.error(error.response?.data?.message ?? t('errorDefault'));
      } else {
        toast.error(t('errorDefault'));
      }
      console.error(error);
    }
  };

  const handleRedirect = (route: string) => {
    navigate(route);
  };

  return (
    <div className="w-[464px] max-w-full rounded-lg bg-white px-10 py-8">
      {/* Header */}
      <div className="mb-3 flex flex-col items-center gap-8">
        <InabitLogo onClick={() => handleRedirect('/')} className="cursor-pointer" />
        <h1 className="font-inter text-2xl font-semibold text-darkText">{t('signUp')}</h1>
      </div>

      {/* Sign Up Providers */}
      <div className="mb-8 flex flex-col gap-3 px-3">
        <BaseButton
          variant="outline"
          classNames="text-[#141418] py-[11px]"
          icon={<GoogleIcon />}
          onClick={handleLoginWithGoogle}
        >
          {t('loginGoogleBtn')}
        </BaseButton>

        <BaseButton
          variant="outline"
          classNames="text-[#141418] py-[11px]"
          icon={<MicrosoftIcon />}
          onClick={() => handleLoginWithMicrosoft()}
          disabled={isSubmitting}
        >
          {t('loginMicrosoftBtn')}
        </BaseButton>

        <AppleSignInButton
          authOptions={appleOptions}
          uiType="dark"
          className="apple-auth-btn"
          noDefaultStyle={false}
          buttonExtraChildren="Continue with Apple"
          onSuccess={handleAppleLoginSuccess}
          onError={handleAppleLoginError}
          skipScript={false}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          render={(props: any) => (
            <BaseButton
              variant="secondary"
              isDark
              icon={<AppleIcon />}
              classNames="py-[11px] text-white"
              {...props}
            >
              {t('loginAppleBtn')}
            </BaseButton>
          )}
        />
      </div>

      <Divider>{t('loginDivider')}</Divider>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-8 flex flex-col gap-[10px] px-3 pt-8">
        {/* Email Input */}
        <Input
          {...register('email', { required: true })}
          placeholder={t('email')}
          className="h-12"
        />
        {errors.email && <ErrorText error={errors.email.message || ''} />}

        {/* Password Input */}
        <div className="relative">
          <Input
            {...register('password', { required: true })}
            placeholder={t('password')}
            type={isShowPassword ? 'text' : 'password'}
            className="h-12"
          />
          <BaseButton
            onClick={handleTogglePassword}
            icon={isShowPassword ? <CloseEyeIcon /> : <EyeIcon />}
            variant="ghost"
            size="icon"
            classNames="absolute top-1/2 -translate-y-1/2 right-2 hover:bg-transparent active:bg-transparent focus:bg-transparent"
          />
        </div>

        {/* Confirm Password Input */}
        <div className="relative">
          <Input
            {...register('confirmPassword', { required: true })}
            placeholder={t('confirmPassword')}
            type={isShowConfirmPassword ? 'text' : 'password'}
            className="h-12"
          />
          <BaseButton
            onClick={handleToggleConfirmPassword}
            icon={isShowConfirmPassword ? <CloseEyeIcon /> : <EyeIcon />}
            variant="ghost"
            size="icon"
            classNames="absolute top-1/2 -translate-y-1/2 right-2 hover:bg-transparent active:bg-transparent focus:bg-transparent"
          />
        </div>

        {errors.password && <ErrorText error={errors.password.message || ''} />}
        {!isPasswordMatch && <ErrorText error={t('passwordMatchError')} />}

        {/* Submit Button */}
        <BaseButton
          classNames="text-white"
          type="submit"
          size="lg"
          loading={isSubmitting}
          disabled={!isValid || isSubmitting || password !== confirmPassword}
        >
          {t('continue')}
        </BaseButton>
      </form>

      {/* Footer */}
      <div className="flex flex-col items-center gap-8 text-center">
        <h5 className="font-inter text-xs font-semibold text-black">
          {t('hasAcc')}{' '}
          <LocaleLink className="text-[#FF3163] underline" to="/login">
            {t('loginTitle')}
          </LocaleLink>
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

export default SignUpForm;

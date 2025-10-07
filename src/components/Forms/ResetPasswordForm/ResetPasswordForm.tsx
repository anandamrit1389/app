import { useContext, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import ErrorText from '@/components/CustomUI/ErrorText/ErrorText';
import useLocaleNavigate from '@/hooks/useLocaleNavigate';
import InabitLogo from '@/assets/logo-inabit-color.svg?react';
import AuthService from '@/api/authService';
import { toast } from 'sonner';
import { createResetPasswordSchema } from '@/schemas/auth.schema';
import EyeIcon from '@/assets/eye.svg?react';
import CloseEyeIcon from '@/assets/close-eye.svg?react';
import { useSubscriptionModal } from '@/hooks/useSubscriptionModal';
import { AuthContext } from '@/providers/auth.provider';
import {
  setAccessTokenToStorage,
  setRefreshTokenToStorage,
  setUserInfoToStorage,
} from '@/helpers/utils/storage';

type ResetPasswordFormData = {
  password: string;
  confirmPassword: string;
};

const ResetPasswordForm = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'auth' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useLocaleNavigate();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const { onOpenChange } = useSubscriptionModal();
  const { handleUserInfo } = useContext(AuthContext);

  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(createResetPasswordSchema(t)),
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<ResetPasswordFormData> = async (data) => {
    if (!token) {
      toast.error(t('invalidResetToken'));
      return;
    }

    setIsSubmitting(true);
    try {
      const {
        data: { accessToken, refreshToken, user },
      } = await AuthService.resetPassword(token, data.password);
      setAccessTokenToStorage(accessToken);
      setRefreshTokenToStorage(refreshToken);
      setUserInfoToStorage(user);
      handleUserInfo({ user, accessToken });
      navigate('/dashboard');

      if (!user.subscription?.activeSubscription) {
        onOpenChange();
      }
    } catch (error) {
      toast.error(t('errorPasswordReset'));
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRedirect = (route: string) => {
    navigate(route);
  };

  return (
    <div className="w-[464px] max-w-full rounded-lg bg-white px-10 py-8">
      <div className="mb-8 flex flex-col items-center gap-8">
        <InabitLogo onClick={() => handleRedirect('/')} className="cursor-pointer" />
        <div className="text-center">
          <h1 className="mb-2 font-inter text-2xl font-semibold text-darkText">
            {t('resetPasswordTitle')}
          </h1>
          <p className="text-gray-600">{t('resetPasswordDescription')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-8 flex flex-col gap-[10px] px-3">
        <div className="relative">
          <Input
            {...register('password')}
            type={isShowPassword ? 'text' : 'password'}
            placeholder={t('newPassword')}
            className="h-12"
          />
          <BaseButton
            onClick={() => setIsShowPassword(!isShowPassword)}
            icon={isShowPassword ? <CloseEyeIcon /> : <EyeIcon />}
            variant="ghost"
            size="icon"
            classNames="absolute top-1/2 -translate-y-1/2 right-2"
          />
        </div>
        {errors.password && <ErrorText error={errors.password.message || ''} />}

        <div className="relative">
          <Input
            {...register('confirmPassword')}
            type={isShowConfirmPassword ? 'text' : 'password'}
            placeholder={t('confirmPassword')}
            className="h-12"
          />
          <BaseButton
            onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
            icon={isShowConfirmPassword ? <CloseEyeIcon /> : <EyeIcon />}
            variant="ghost"
            size="icon"
            classNames="absolute top-1/2 -translate-y-1/2 right-2"
          />
        </div>
        {errors.confirmPassword && <ErrorText error={errors.confirmPassword.message || ''} />}

        <BaseButton
          type="submit"
          size="lg"
          loading={isSubmitting}
          disabled={!isValid || isSubmitting}
          classNames="text-white mt-4"
        >
          {t('resetPasswordBtn')}
        </BaseButton>
      </form>
    </div>
  );
};

export default ResetPasswordForm;

import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { useTranslation } from 'react-i18next';
import LocaleLink from '@/components/Locales/LocaleLink/LocaleLink';
import ErrorText from '@/components/CustomUI/ErrorText/ErrorText';
import useLocaleNavigate from '@/hooks/useLocaleNavigate';
import InabitLogo from '@/assets/logo-inabit-color.svg?react';
import AuthService from '@/api/authService';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';
import { ForgotPasswordCredentials } from '@/interfaces/auth.interface';
import { createForgotPasswordSchema } from '@/schemas/auth.schema';
// import ReCAPTCHA from "react-google-recaptcha";

const ForgotPasswordForm = () => {
  const { lng } = useParams();
  const { t } = useTranslation('translation', { keyPrefix: 'auth' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useLocaleNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  // const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [retryAfter, setRetryAfter] = useState<number | null>(null);
  const [retryTimer, setRetryTimer] = useState<number | null>(null);
  // const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleRedirect = (route: string) => {
    navigate(route);
  };

  // const handleCaptchaChange = (value: string | null) => {
  //   setCaptchaValue(value);
  // };

  // const resetCaptcha = () => {
  // setCaptchaValue(null);
  // if (recaptchaRef.current) {
  //   recaptchaRef.current.reset();
  // }
  // };
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (retryAfter && retryAfter > 0) {
      setRetryTimer(retryAfter);

      intervalId = setInterval(() => {
        setRetryTimer((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(intervalId);
            setRetryAfter(null);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [retryAfter]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordCredentials>({
    resolver: zodResolver(createForgotPasswordSchema(t)),
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<ForgotPasswordCredentials> = async (data) => {
    // if (!captchaValue) {
    //   toast.error(t("pleaseCompleteCaptcha"));
    //   return;
    // }

    setIsSubmitting(true);
    try {
      await AuthService.forgotPassword(data.email, lng as string);
      setIsSuccess(true);
      toast.success(t('successPasswordResetEmail'));
    } catch (error) {
      // resetCaptcha();

      if (error instanceof AxiosError) {
        if (error.response?.status === 429) {
          const retryAfterHeader = error.response.headers['retry-after'];
          const retryAfterValue = retryAfterHeader
            ? parseInt(retryAfterHeader, 10)
            : error.response?.data?.retryAfter || 300;

          setRetryAfter(retryAfterValue);
          const minutes = Math.ceil(retryAfterValue / 60);

          toast.error(t('tooManyPasswordResetAttempts', { minutes }));
        } else {
          toast.error(error.response?.data?.message ?? t('errorDefault'));
        }
      } else {
        toast.error(t('errorDefault'));
      }
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimeRemaining = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isSuccess) {
    return (
      <div className="w-[464px] max-w-full rounded-lg bg-white px-10 py-8">
        <div className="flex flex-col items-center gap-8">
          <InabitLogo onClick={() => handleRedirect('/')} className="cursor-pointer" />
          <div className="text-center">
            <h1 className="font-inter mb-2 text-2xl font-semibold text-darkText">
              {t('forgotPasswordTitle')}
            </h1>
            <p className="text-gray-600">{t('recoveryLinkSentDescription')}</p>
          </div>
          <LocaleLink to="/login" className="text-sm text-[#FF3163] hover:text-[#ff4373]">
            {t('backToLogin')}
          </LocaleLink>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[464px] max-w-full rounded-lg bg-white px-10 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col items-center gap-8">
        <InabitLogo onClick={() => handleRedirect('/')} className="cursor-pointer" />
        <div className="text-center">
          <h1 className="font-inter mb-2 text-2xl font-semibold text-darkText">
            {t('forgotPasswordTitle')}
          </h1>
          <p className="text-gray-600">{t('forgotPasswordDescription')}</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-8 flex flex-col gap-[10px] px-3">
        <div className="relative">
          <Input
            {...register('email', { required: true })}
            placeholder={t('email')}
            className="h-12"
            type="email"
          />
        </div>
        {errors.email && <ErrorText error={errors.email.message || ''} />}

        {/* <div className="my-3 flex justify-center">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={
              import.meta.env.RECAPTCHA_KEY ||
              "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
            }
            onChange={handleCaptchaChange}
            theme={retryTimer !== null ? "dark" : "light"}
          />
        </div> */}

        {retryTimer !== null && (
          <div className="bg-red-50 text-red-700 mt-2 rounded-md p-3 text-center text-sm">
            {t('tooManyAttempts')} {formatTimeRemaining(retryTimer)}
          </div>
        )}

        <BaseButton
          type="submit"
          size="lg"
          loading={isSubmitting}
          disabled={!isValid || isSubmitting}
          classNames="text-white mt-4"
        >
          {t('resetPassword')}
        </BaseButton>
      </form>

      {/* Footer */}
      <div className="text-center">
        <LocaleLink to="/login" className="text-sm text-[#FF3163] hover:text-[#ff4373]">
          {t('backToLogin')}
        </LocaleLink>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;

import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { cn } from '@/lib/utils';
import LanguageSelect from '@/components/Selects/LanguageSelect/LanguageSelect';
import { useTranslation } from 'react-i18next';
import { cookieSchema } from '@/schemas/cookieSchema.schema';
import WorldDarkIcon from '@/assets/worldDark.svg?react';
import { useCookieConsent } from '../hooks/useCookieConsent';
import { CookieConsentValue } from '../types';
import { useEffect } from 'react';

export type CookieConsentFormData = z.infer<typeof cookieSchema>;

interface CookieConsentModalProps {
  isMobile: boolean;
}

export const CookieSettingsModal = ({ isMobile }: CookieConsentModalProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'cookieConsent' });

  const {
    consent,
    isShowSettings,
    onSave,
    onShowSettings,
    onCloseSettings,
    onShowBanner,
    onCloseBanner,
  } = useCookieConsent();

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(cookieSchema),
    defaultValues: {
      essential: true,
      performance: false,
      functional: false,
      targeting: false,
    },
  });

  const onSubmit = async (data: CookieConsentFormData) => {
    onSave(data as unknown as CookieConsentValue);
    onCloseBanner();
    onCloseSettings();
  };

  // const loadConsentFromStorage = () => {
  //   const stored = localStorage.getItem("cookieConsent");
  //   if (!stored) return;

  //   try {
  //     const parsed = JSON.parse(stored);
  //     reset({
  //       essential: true,
  //       performance: parsed.performance ?? true,
  //       functional: parsed.functional ?? true,
  //       targeting: parsed.targeting ?? true,
  //     });
  //   } catch (err) {
  //     console.warn("Invalid cookieConsent in localStorage");
  //   }
  // };

  const handleCloseDialog = () => {
    if (consent) {
      onCloseSettings();
    } else {
      onCloseSettings();
      onShowBanner();
    }
  };

  useEffect(() => {
    if (consent) {
      reset(consent);
    }
  }, []);

  if (!isShowSettings) return null;

  return (
    <Dialog open={isShowSettings} onOpenChange={handleCloseDialog}>
      <DialogContent
        className={cn(
          'flex flex-col p-6 overflow-hidden rounded-lg max-w-[552px] max-h-[calc(100dvh-32px)] !animate-none !duration-0 data-[state=open]:!animate-none data-[state=closed]:!animate-none data-[state=open]:!fade-in-0 data-[state=closed]:!fade-out-0 data-[state=open]:!zoom-in-100 data-[state=closed]:!zoom-out-100 data-[state=open]:!slide-in-from-left-0 data-[state=open]:!slide-in-from-top-0 data-[state=closed]:!slide-out-to-left-0 data-[state=closed]:!slide-out-to-top-0',
          {
            'translate-x-[-50%] translate-t-[-50%] pb-0 top-1/2 left-1/2 [&>button]:flex w-[600px] max-w-[calc(100%-32px)] gap-10':
              isShowSettings,
          },
        )}
      >
        <DialogHeader
          className={cn('text-left', {
            'px-4 pt-4': isShowSettings,
            'px-0': !isShowSettings,
          })}
        >
          <DialogTitle className="mb-1.5 flex items-center justify-between text-lg font-semibold text-darkText">
            {t('title')}
            {!isShowSettings && (
              <LanguageSelect
                icon={<WorldDarkIcon />}
                align="end"
                triggerClassName="hover:bg-[#F6F7F8] active:bg-lightGreyHover [&>svg:last-of-type]:hidden border-none bg-transparent"
                contentClassName="bottom-7 -right-6"
              />
            )}
          </DialogTitle>
          <div className="mb-[16px] text-sm text-darkText">
            {t('descriptionPart1')}{' '}
            <button
              onClick={onShowSettings}
              className="cursor-pointer underline hover:no-underline"
            >
              {t('cookiesSettingsLink')}
            </button>
            .
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto">
          <div
            className={cn({
              'flex flex-col pb-28 gap-10 px-4': isShowSettings,
              hidden: !isShowSettings,
            })}
          >
            {['essential', 'performance', 'functional', 'targeting'].map((name) => (
              <div key={name} className="flex gap-4">
                <Controller
                  name={name as 'essential' | 'performance' | 'functional' | 'targeting'}
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id={name}
                      disabled={name === 'essential'}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="col-span-3"
                    />
                  )}
                />
                <div className="flex flex-col">
                  <label
                    htmlFor={name}
                    className="cursor-pointer text-base font-bold leading-6 text-darkText"
                  >
                    {t(`${name}CookiesTitle`)}
                  </label>
                  <p className="text-base text-darkText">{t(`${name}CookiesDescription`)}</p>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter
            className={cn(
              "p-6 bottom-0 bg-white w-full left-0 md:static flex flex-row gap-4 before:content-[''] before:absolute before:w-full before:h-px before:left-0 before:bottom-24 before:bg-[#00000010] py-6 absolute",
            )}
          >
            <BaseButton
              variant="outline"
              size="lg"
              classNames="w-[154px] [@media(max-width:374px)]:w-[114px] focus:bg-white"
              onClick={handleCloseDialog}
            >
              {isMobile ? t('exit') : t('cancel')}
            </BaseButton>
            <BaseButton
              type="submit"
              size="lg"
              classNames="w-[154px] [@media(max-width:374px)]:w-[114px] !ml-0"
            >
              {t('saveSettings')}
            </BaseButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

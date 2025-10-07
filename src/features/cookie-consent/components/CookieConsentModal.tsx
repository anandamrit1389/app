import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { cn } from '@/lib/utils';
import LanguageSelect from '@/components/Selects/LanguageSelect/LanguageSelect';
import { useTranslation } from 'react-i18next';
import WorldDarkIcon from '@/assets/worldDark.svg?react';
import { useCookieConsent } from '../hooks/useCookieConsent';

export const CookieConsentModal = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'cookieConsent' });

  const { isShowBanner, isShowSettings, onShowSettings, onCloseBanner, onAcceptAll } =
    useCookieConsent();

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
    if (isShowSettings) {
      onCloseBanner();
    }
  };

  const handleOpenSettings = () => {
    onCloseBanner();
    onShowSettings();
  };

  if (!isShowBanner) return null;

  return (
    <Dialog open={isShowBanner} onOpenChange={handleCloseDialog}>
      <DialogContent
        className={cn(
          'flex flex-col p-6 overflow-hidden rounded-lg max-h-[calc(100dvh-32px)] !animate-none !duration-0 data-[state=open]:!animate-none data-[state=closed]:!animate-none data-[state=open]:!fade-in-0 data-[state=closed]:!fade-out-0 data-[state=open]:!zoom-in-100 data-[state=closed]:!zoom-out-100 data-[state=open]:!slide-in-from-left-0 data-[state=open]:!slide-in-from-top-0 data-[state=closed]:!slide-out-to-left-0 data-[state=closed]:!slide-out-to-top-0 -translate-x-1/2 md:translate-x-0 translate-y-0 top-auto bottom-3 md:bottom-8 left-1/2 md:left-10 [&>button]:hidden w-[600px] max-w-[calc(100%-16px)] gap-4',
        )}
      >
        <DialogHeader className={cn('text-left px-0', {})}>
          <DialogTitle className="mb-1.5 flex items-center justify-between text-lg font-semibold text-darkText">
            {t('title')}
            <LanguageSelect
              icon={<WorldDarkIcon />}
              align="end"
              triggerClassName="hover:bg-[#F6F7F8] active:bg-lightGreyHover [&>svg:last-of-type]:hidden border-none bg-transparent"
              contentClassName="bottom-7 -right-6"
            />
          </DialogTitle>
          <div className="mb-[16px] text-sm text-darkText">
            {t('descriptionPart1')}{' '}
            <button
              onClick={handleOpenSettings}
              className="cursor-pointer underline hover:no-underline"
            >
              {t('cookiesSettingsLink')}
            </button>
            .
          </div>
        </DialogHeader>

        <DialogFooter
          className={cn(
            "p-6 bottom-0 bg-white w-full left-0 md:static flex flex-row gap-4 before:content-[''] before:absolute before:w-full before:h-px before:left-0 before:bg-transparent before:bottom-24",
          )}
        >
          <BaseButton
            variant="outline"
            size="lg"
            classNames="w-[154px] [@media(max-width:374px)]:w-[114px] focus:bg-white"
            onClick={handleOpenSettings}
          >
            {t('settings')}
          </BaseButton>
          <BaseButton
            onClick={onAcceptAll}
            size="lg"
            classNames="w-[154px] [@media(max-width:374px)]:w-[114px] !ml-0"
          >
            {t('accept')}
          </BaseButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/providers/auth.provider';
import TemplateIcon from '@/assets/icon-placeholder.svg?react';
import { TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Tooltip } from '@/components/ui/tooltip';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import TemplateIconRed from '@/assets/template-red-icon.svg?react';
import { X } from 'lucide-react';
import {
  getPresentationLimitNotification,
  setPresentationLimitNotification,
} from '@/helpers/utils/storage';

export const PresentationLimitCounter = () => {
  const { user, hasActiveSubscription } = useContext(AuthContext);
  const { t } = useTranslation('translation', { keyPrefix: 'dashboard' });
  const [showBanner, setShowBanner] = useState(false);

  const isLimitLow = hasActiveSubscription
    ? (user?.presentationLimit ?? 0) <= 3 && user?.extraPresentationLimit === 0
    : (user?.extraPresentationLimit ?? 0) <= 1;

  useEffect(() => {
    if (isLimitLow) {
      const hasShownNotification = getPresentationLimitNotification();
      if (!hasShownNotification) {
        setShowBanner(true);
        setPresentationLimitNotification();
      }
    }
  }, [isLimitLow]);

  const handleCloseBanner = () => {
    setShowBanner(false);
    setPresentationLimitNotification();
  };

  const getCounterText = () => {
    const freeLimit = user?.extraPresentationLimit ?? 0;
    const proLimit = user?.presentationLimit ?? 0;

    if (freeLimit > 0) {
      return `${freeLimit} ${freeLimit === 1 ? t('freePresentationLeft') : t('freePresentationsLeft')}`;
    }

    if (hasActiveSubscription) {
      const totalLimit = user?.subscription?.ownedSubscription?.interval === 'month' ? 15 : 180;
      return `${proLimit} / ${totalLimit} ${t('left')}`;
    }

    return `0 / 3 ${t('left')}`;
  };

  const getTooltipContent = () => {
    if (hasActiveSubscription) {
      if (user?.extraPresentationLimit && user.extraPresentationLimit > 0) {
        return t('usingFreePresentationsFirst');
      }
      const proLimit = user?.presentationLimit ?? 0;
      if (proLimit === 0) {
        return t('presentationQuotaReset');
      }
      if (proLimit <= 3) {
        return t('presentationQuotaRunningLow');
      }
    }
    if (!hasActiveSubscription) {
      return t('create3FreePresentations');
    }
    return null;
  };

  const tooltipContent = getTooltipContent();

  return (
    <>
      {showBanner && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-darkBanner text-white shadow-lg transition-transform duration-300 ease-in-out">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TemplateIconRed className="size-5" />
              <div>
                <h3 className="font-semibold text-sm">{t('presentationQuotaRunningLow')}</h3>
                <p className="text-xs text-gray-300">
                  {hasActiveSubscription
                    ? t('presentationQuotaReset')
                    : t('create3FreePresentations')}
                </p>
              </div>
            </div>
            <button
              onClick={handleCloseBanner}
              className="text-gray-300 hover:text-white transition-colors"
              aria-label="Close notification"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 text-xs h-6 text-darkText cursor-default outline outline-goldBorder rounded-full p-2">
              <TemplateIcon className="size-4" />
              <span className="font-semibold">{getCounterText()}</span>
            </div>
          </TooltipTrigger>
          {tooltipContent && (
            <TooltipContent className={cn('bg-darkBanner border-none shadow-lg')}>
              <p className="text-white max-w-[300px] text-pretty">{tooltipContent}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </>
  );
};

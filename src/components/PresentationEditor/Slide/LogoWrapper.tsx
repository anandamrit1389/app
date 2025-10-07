import { ReactElement, useContext } from 'react';
import { PresentationContext } from '../../../contexts/Presentation.context';

import useDeviceDetect from '@/hooks/useDeviceDetect';
import { cn } from '@/lib/utils';
import { useSubscriptionModal } from '@/hooks/useSubscriptionModal';
import InabitLogo from '@/assets/logo-inabit-color.svg?react';

const LogoWrapper = ({
  hide,
  children,
  pageNumber,
}: {
  children: ReactElement;
  hide?: boolean;
  pageNumber: number;
}) => {
  const { isMobile } = useDeviceDetect();
  const { onOpenChange } = useSubscriptionModal();

  const { presentation, showPages, tempUrl, showTitle, readonly, showWatermark, selectedLanguage, activeSlide } =
    useContext(PresentationContext);

  const isShowBottomBar = showWatermark;
  const isChartSlide = activeSlide?.chartType !== undefined && activeSlide?.chartType !== null;

  if (hide) return <>{children}</>;

  return (
    <div className={cn('size-full overflow-hidden overflow-y-auto')}>
      {showTitle && !isChartSlide && (
        <div
          className={cn(
            'z-10 flex items-center justify-between h-slideHeaderHeight absolute top-0 left-0 w-full',
          )}
        >
          <div className="z-10 p-presentation font-bodyFont text-normalTextFontSize text-normalText">
            {showTitle && (
              <p className='presTitle'>
                {presentation?.titleTranslations?.[selectedLanguage] ?? presentation?.title ?? ''}
              </p>
            )}
          </div>
          <div className="flex h-maxLogoHeight flex-col items-center justify-center p-presentation text-normalTextFontSize text-normalText">
            {tempUrl && <img src={tempUrl} className="h-maxLogoHeight" crossOrigin="anonymous" />}
          </div>
        </div>
      )}
      {children}
      {isShowBottomBar && (
        <div
          className={cn(
            'absolute bottom-4 left-4 z-[29] cursor-pointer',
            {
              'left-2 bottom-2': isMobile,
            },
          )}
        >
          {!readonly ? (
            <div
              onClick={onOpenChange}
            >
              <InabitLogo className="size-logoSize logo-watermark" />
            </div>
          ) : (
            <a
              href="https://www.inabit.ai/"
              target="_blank"
            >
              <InabitLogo className="size-logoSize logo-watermark" />
            </a>
          )}
        </div>
      )}
      {showPages && (
        <div className="absolute bottom-[29px] right-4 font-bodyFont text-normalTextFontSize text-normalText sm:bottom-0 sm:right-0 sm:p-presentation">
          <p>{pageNumber}</p>
        </div>
      )}
    </div>
  );
};

export default LogoWrapper;

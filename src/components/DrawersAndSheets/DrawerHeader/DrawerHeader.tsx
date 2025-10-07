import BackArrow from '@/assets/arrow-left.svg?react';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DrawerHeaderProps {
  title?: string;
  nextBtnText?: string;
  isDisabledNextButton?: boolean;
  onPrevClick?: () => void;
  onNextClick?: () => void;
  onCancelClick?: () => void;
  onClose?: () => void;
}

const DrawerHeader = ({
  title,
  nextBtnText,
  isDisabledNextButton,
  onNextClick,
  onPrevClick,
  onCancelClick,
  onClose,
}: DrawerHeaderProps) => {
  const { t } = useTranslation('translation');
  
  return (
    <header className="relative flex w-full items-center justify-center md:justify-between">
      <div className="flex items-center gap-1">
        {onPrevClick && (
          <button
            onClick={onPrevClick}
            className="absolute left-0 top-1/2 -translate-y-1/2 md:static md:translate-y-0"
          >
            <BackArrow />
          </button>
        )}

        <h4 className="text-base font-bold text-darkHeadline md:text-2xl">{title}</h4>
      </div>

      {onCancelClick && (
        <div className="fixed inset-x-0 bottom-0 flex bg-white p-4 shadow-elevate-3 md:static md:p-0 md:shadow-none z-[10]">
          <BaseButton
            onClick={onCancelClick}
            classNames="h-10 w-full"
            variant='outline'
            disabled={isDisabledNextButton}
          >
            {t('demoPreview.abort')}
          </BaseButton>
        </div>
      )}

      {nextBtnText && onNextClick && (
        <div className="fixed inset-x-0 bottom-0 flex bg-white p-4 shadow-elevate-3 md:static md:p-0 md:shadow-none z-[10]">
          <BaseButton
            onClick={onNextClick}
            classNames="h-10 w-full"
            disabled={isDisabledNextButton}
          >
            {nextBtnText}
          </BaseButton>
        </div>
      )}

      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-lightGrey p-1 transition-all hover:opacity-90 md:hidden"
        >
          <X className="size-3" />
          <span className="sr-only">Close</span>
        </button>
      )}
    </header>
  );
};

export default DrawerHeader;

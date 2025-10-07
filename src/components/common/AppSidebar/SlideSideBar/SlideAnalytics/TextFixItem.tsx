import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { SlideFixItemBase } from './SlideFixItemBase';
import AIStar from '@/assets/ai-star-black.svg?react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { ITextResult } from '@/hooks/useSlideAnalytics/interfaces';
import { useState } from 'react';
import LayoutSelector from '@/components/DrawersAndSheets/PresentationOutlineDrawer/OutlineSlideItem/LayoutSelector';
import { ISlide, SlideTypes } from '@/interfaces/ISlides';

export const TextFixItem = ({
  result,
  loading,
  onShowMeSelectedText,
  onFix,
  onRemove,
  onChangeLayout,
  slide,
}: {
  result: ITextResult;
  loading: boolean;
  onShowMeSelectedText?: () => void;
  onFix: () => void;
  onRemove: () => void;
  onChangeLayout?: (type: SlideTypes, variant: string) => void;
  slide?: ISlide;
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'analytics' });
  const [isLayoutSelectorOpen, setIsLayoutSelectorOpen] = useState(false);
  
  const showChangeLayout = result.result === 'longText' && onChangeLayout;

  const handleLayoutSelect = (type: string, variant: string) => {
    setIsLayoutSelectorOpen(false);
    
    if (onChangeLayout && slide) {
      const slideType = type as SlideTypes;
      onChangeLayout(slideType, variant);
    }
  };

  return (
    <>
      <SlideFixItemBase
        item={{
          color: result.color,
          title: t(`${result.result}.title`),
          description: t(`${result.result}.description`),
        }}
        onRemove={onRemove}
      >
        <div className="flex gap-2">
          <BaseButton
            variant="outline"
            size="sm"
            classNames="px-3 font-semibold text-xs h-8"
            onClick={onShowMeSelectedText}
          >
            {t('showMe')}
          </BaseButton>

          <BaseButton
            variant="outline"
            size="sm"
            classNames={cn('px-3 font-semibold text-xs h-8')}
            onClick={onFix}
            loading={loading}
          >
            <AIStar /> {t('fixIt')}
          </BaseButton>
          
          {showChangeLayout && (
            <BaseButton
              variant="outline"
              size="sm"
              classNames={cn('px-3 font-semibold text-xs h-8')}
              onClick={() => setIsLayoutSelectorOpen(true)}
            >
             {t('changeLayout')}
            </BaseButton>
          )}
        </div>
      </SlideFixItemBase>

      {slide && (
        <LayoutSelector
          open={isLayoutSelectorOpen}
          onOpenChange={() => setIsLayoutSelectorOpen(!isLayoutSelectorOpen)}
          outline={slide}
          onSelect={handleLayoutSelect}
        />
      )}
    </>
  );
};

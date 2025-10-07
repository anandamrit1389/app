import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { ChevronLeft, ChevronRight, EllipsisVertical } from 'lucide-react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { PresentationContext } from '@/contexts/Presentation.context';
import { cn } from '@/lib/utils';
import useDeviceDetect from '@/hooks/useDeviceDetect';
import { AnalyticsContext } from '@/contexts/Analytics.context';
import { getButtonStatus } from '@/hooks/useSlideAnalytics/helpers';
import SlideEditActions from './SlideEditActions';

interface SlideActionsProps {
  onMoveLayout: (direction: 'prev' | 'next') => void;
}

const SlideActions = ({ onMoveLayout }: SlideActionsProps) => {
  const { slideAlternatives, presentation, readonly, showSideBar, activeSlide } =
    useContext(PresentationContext);
  const { getSlideImprovements, isSlideParsed } = useContext(AnalyticsContext);

  const isGenerating = !presentation?.generationFinished;

  const { isMobile } = useDeviceDetect();

  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });

  const activeSlideImprovements = getSlideImprovements(activeSlide?.slideNumber);

  const isSlideConverted = isSlideParsed(activeSlide?.slideNumber);

  const slideStatus = getButtonStatus(activeSlideImprovements, isSlideConverted);

  if (readonly) return;

  return (
    <div
      className={cn(
        `left-1/2 z-30 flex -translate-x-1/2 items-center gap-8 rounded-full border border-neutral-100 bg-white px-5 py-2 text-sm text-black transition-all `,
        {
          'fixed bottom-2': isMobile,
          'absolute bottom-0 translate-y-1/2': !isMobile,
        },
      )}
    >
      {slideAlternatives && slideAlternatives.length > 1 && (
        <div className="flex items-center gap-3 font-medium">
          {t('layouts')}
          <div className="flex items-center gap-1">
            <BaseButton
              icon={<ChevronLeft />}
              size="icon"
              variant="outline"
              classNames="rounded-full size-8"
              onClick={() => onMoveLayout('prev')}
            />
            <BaseButton
              icon={<ChevronRight />}
              size="icon"
              variant="outline"
              classNames="rounded-full size-8"
              onClick={() => onMoveLayout('next')}
            />
          </div>
        </div>
      )}
      <BaseButton
        variant="secondary"
        onClick={() => showSideBar('analytics')}
        classNames="rounded-lg h-8"
        // disabled={isGenerating}
      >
        <div
          className={cn('size-2 rounded-full', {
            'bg-[#3BD73E]': slideStatus.color === '#3BD73E', //TODO: need to improve
            'bg-[#FFAB24]': slideStatus.color === '#FFAB24',
            'bg-[#F34749]': slideStatus.color === '#F34749',
            'bg-[#312929]': slideStatus.color === '#312929',
          })}
        ></div>
        {t(slideStatus.status)}
      </BaseButton>

      <div className="flex items-center gap-3 whitespace-nowrap font-medium">
        <BaseButton
          variant="secondary"
          size="icon"
          onClick={() => showSideBar('slide')}
          classNames="transition-all w-[20px] rounded-lg p-0 overflow-hidden h-8"
          disabled={isGenerating}
        >
          <EllipsisVertical className="size-8" />
        </BaseButton>
      </div>
      <SlideEditActions isGenerating={isGenerating} />
    </div>
  );
};

export default SlideActions;

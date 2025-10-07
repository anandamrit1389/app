import { useEffect } from 'react';
import { useSwiper } from 'swiper/react';
import classNames from 'classnames';
import SlideFactory from '@/components/PresentationEditor/SlideFactory/SlideFactory';
import { IPresentation, ISlide } from '@/interfaces/ISlides';
import TemplatePreview from '@/components/Templates/TemplatePreview';

interface TemplateSlideCardsProps {
  presentation: IPresentation;
  index: number;
  mobile?: boolean;
}

const TemplateSlideCards = ({ presentation, index, mobile = false }: TemplateSlideCardsProps) => {
  const swiper = useSwiper();

  useEffect(() => {
    swiper.slideTo(index, 0);
  }, [index, swiper]);

  const gridClasses = classNames('grid overflow-auto py-3', {
    'grid-cols-3 gap-4 px-1 pb-5 w-12/12': !mobile,
    'grid-cols-2 gap-3 px-1 w-11/12': mobile,
  });

  const renderSlide = (slide: ISlide) => (
    <TemplatePreview
      key={slide.id}
      isMobile={mobile}
      theme={presentation.themeId}
      font={presentation.fontFamily}
      slideType={slide.slideType}
    >
      <SlideFactory slide={slide} isPreview />
    </TemplatePreview>
  );

  return (
    <div className="relative">
      <div className="flex size-full justify-center">
        <div className={gridClasses}>{presentation?.slides.map(renderSlide)}</div>
      </div>
    </div>
  );
};

export default TemplateSlideCards;

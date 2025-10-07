import { ISlide } from '@/interfaces/ISlides';
import SlideFactory from '../../SlideFactory/SlideFactory';
import { PresentationContext } from '@/contexts/Presentation.context';
import { useContext, useEffect } from 'react';
import LogoWrapper from '../LogoWrapper';
import classNames from 'classnames';
import { useSwiper } from 'swiper/react';
import SlideActions from '../SlideActions';
import useScreenSize from '@/hooks/useScreenSize';

interface IProps {
  slide: ISlide;
  index: number;
  isPreview?: boolean;
  readonly?: boolean;
  presentationModeSlideIndex?: number;
}

const MobileSlide = ({ slide, index, isPreview, readonly, presentationModeSlideIndex }: IProps) => {
  const {
    theme,
    fontFamily,
    isFullscreen,
    activeSlide,
    handleMoveLayout,
    countAgendaSlides,
    showAgenda,
    isSideBarActive,
    exportOpen,
  } = useContext(PresentationContext);

  const swiper = useSwiper();

  useScreenSize(isSideBarActive, true, isFullscreen, exportOpen);

  useEffect(() => {
    if (!isPreview && activeSlide) {
      swiper.slideTo(activeSlide?.slideNumber - countAgendaSlides - 1);
    }
  }, [activeSlide, isPreview, swiper, showAgenda, countAgendaSlides]);

  return (
    <div
      key={index}
      className={classNames('flex flex-col items-center justify-center relative', {
        'h-dvh': !isPreview,
        'bg-grey': isPreview,
      })}
    >
      <div className="relative flex size-full items-center justify-center">
        <div
          className={`theme-${theme} font-family-${fontFamily} bg-pageBg relative overflow-hidden aspect-video w-full mx-auto rounded-xl`}
        >
          <LogoWrapper
            pageNumber={slide?.slideNumber}
            hide={
              isPreview || slide.slideType === 'title-slide' || slide.slideType === 'images-slide'
            }
          >
            <SlideFactory
              slide={slide}
              isPreview={isFullscreen || isPreview || readonly}
              presentationModeSlideIndex={presentationModeSlideIndex}
            />
          </LogoWrapper>
        </div>

        {!isPreview && !isFullscreen && (
          <SlideActions onMoveLayout={(direction) => handleMoveLayout(slide, direction)} />
        )}
      </div>
    </div>
  );
};

export default MobileSlide;

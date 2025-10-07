import { useContext } from 'react';
import classNames from 'classnames';
import { PresentationContext } from '../../../contexts/Presentation.context';
import useScrollToCenter from '../../../hooks/useScrollToCenter';
import { ISlide } from '../../../interfaces/ISlides';
import SlideFactory from '../SlideFactory/SlideFactory';
import LogoWrapper from './LogoWrapper';
import useScreenSize from '@/hooks/useScreenSize';
import StandBy from './Standby';
import SlideActions from './SlideActions';
import { getPageWithOffset } from '@/helpers/utils/agenda';
import useMobile from '@/hooks/useMobile';

interface IProps {
  slide: ISlide;
  isPreview?: boolean;
  index: number;
  presentationModeSlideIndex?: number;
  isForExport?: boolean;
}

const Slide = ({ slide, isPreview, presentationModeSlideIndex, isForExport }: IProps) => {
  const {
    changeActiveSlide,
    activeSlide,
    isSideBarActive,
    isFullscreen,
    theme,
    fontFamily,
    presentation,
    showAgenda,
    handleMoveLayout,
  } = useContext(PresentationContext);

  const scrollRef = useScrollToCenter(activeSlide?.id === slide.id, isSideBarActive);

  useScreenSize(isSideBarActive, false, isFullscreen, isForExport);
  const isMobile = useMobile();

  const isGenerating = !presentation?.generationFinished;

  const pageNumber = presentation ? getPageWithOffset(presentation.slides, slide, showAgenda) : 0;

  return (
    <div
      className={classNames('flex relative items-center justify-center group', {
        'h-[calc(100dvh-64px)]': !isFullscreen,
      })}
    >
      <div className="relative">
        <div
          onClick={() => {
            changeActiveSlide(slide.id);
          }}
          className={classNames(
            `w-slideMax aspect-video bg-pageBg overflow-hidden type-${slide.slideType}`,
            {
              [`font-family-${fontFamily}`]: true,
              [`theme-${slide.themeId}`]: slide.themeId,
              [`theme-${theme}`]: !slide.themeId,
              'rounded-lg outline outline-1 outline-[#00000014]': !isFullscreen,
            },
          )}
        >
          <div
            className={`slide-container relative size-full rounded-lg bg-pageBg ${slide.skipSlide ? 'skip' : ''}`}
            ref={(node) => {
              scrollRef.current = node;
            }}
          >
            <LogoWrapper
              pageNumber={pageNumber}
              hide={
                isPreview ||
                slide.variation === 'full' ||
                slide.slideType === 'images-slide'
              }
            >
              <SlideFactory
                slide={slide}
                isPreview={isPreview || isFullscreen}
                presentationModeSlideIndex={presentationModeSlideIndex}
              />
            </LogoWrapper>
          </div>
        </div>

        {!isPreview && !isFullscreen && !isGenerating && !isMobile && (
          <SlideActions onMoveLayout={(direction) => handleMoveLayout(slide, direction)} />
        )}
      </div>

      <StandBy />
    </div>
  );
};

export default Slide;

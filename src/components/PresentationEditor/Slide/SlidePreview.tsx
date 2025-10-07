import { useContext } from 'react';
import classNames from 'classnames';
import { PresentationContext } from '../../../contexts/Presentation.context';
import useScrollToCenter from '../../../hooks/useScrollToCenter';
import { ISlide } from '../../../interfaces/ISlides';
import SlideFactory from '../SlideFactory/SlideFactory';
import useHoverActions from '../../../hooks/useHoverActions';
import LogoWrapper from './LogoWrapper';
import Skip from '@/assets/eye-cross.svg?react';

interface IProps {
  slide: ISlide;
  className?: string;
  mobile?: boolean;
}

const SlidePreview = ({ slide, className, mobile }: IProps) => {
  const { activeSlide, theme, fontFamily, changeActiveSlide, presentation } =
    useContext(PresentationContext);

  const { isHovered, handleMouseEnter, handleMouseLeave } = useHoverActions();

  const scrollRef = useScrollToCenter(activeSlide?.id === slide.id, false, true);

  const isActive = activeSlide?.id === slide.id;

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        if (presentation?.generationFinished) {
          changeActiveSlide(slide.id);
        }
      }}
      className={classNames(
        `preview aspect-video bg-pageBg overflow-hidden rounded type-${slide.slideType}`,
        {
          'w-full': mobile,
          'w-slideMax': !mobile,
          'rounded outline outline-2 outline-offset-[3px]': isActive || isHovered,
          'outline-pink outline-offset-2': isActive,
          'outline outline-1 outline-lightGreyHover': !isActive,
          [`font-family-${fontFamily}`]: true,
          [`theme-${slide.themeId}`]: slide.themeId,
          [`theme-${theme}`]: !slide.themeId,
        },
        className,
      )}
      ref={(node) => {
        scrollRef.current = node;
      }}
    >
      <div className={classNames('bg-pageBg size-full relative slide-container rounded-lg')}>
        {slide.skipSlide && (
          <div className="absolute z-50 flex size-full items-center justify-center bg-lightGrey/[0.7]">
            <Skip className="me-2" />
          </div>
        )}
        <LogoWrapper pageNumber={slide?.slideNumber} hide>
          <SlideFactory slide={slide} isPreview isPresentationSidePreview />
        </LogoWrapper>
      </div>
    </div>
  );
};

export default SlidePreview;

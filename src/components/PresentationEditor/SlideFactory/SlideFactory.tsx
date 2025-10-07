import { ISlide, ISlideWithChartData } from '../../../interfaces/ISlides';
import ImageCaptionSlide from './Slides/ImageCaptionSlide';
import ChartSlide from './Slides/ChartSlide';
import ContentsSlide from './Slides/ContentsSlide';
import ImportantTextSlide from './Slides/ImportantTextSlide';
import ImageTextSlide from './Slides/ImageTextSlide';
import TitleSlide from './Slides/TitleSlide';
import BulletPointsSlide from './Slides/BulletPointsSlide';
import SectionHeadlineSlide from './Slides/SectionHeadlineSlide';
import TextSlide from './Slides/TextSlide';
import ImagesSlide from './Slides/ImagesSlide';
import ShapesSlide from './Slides/ShapesSlide';
import ClosingSlide from './Slides/ClosingSlide';

import { useContext } from 'react';
import { PresentationContext } from '@/contexts/Presentation.context';
import { cn } from '@/lib/utils';
import Loader from '@/assets/loader-color.svg?react';
import SimpleTable from './Slides/SimpleTable';
import FreeSlide from './Slides/FreeSlide';
import ScreenSlide from './Slides/ScreenSlide';

interface IProps {
  slide: ISlide;
  isPreview?: boolean;
  mobile?: boolean;
  isPresentationSidePreview?: boolean;
  presentationModeSlideIndex?: number;
  description?: string;
}

const SlideFactory = ({
  slide,
  isPreview,
  mobile,
  isPresentationSidePreview = false,
  presentationModeSlideIndex,
  description
}: IProps) => {
  const { currentElement, slideLoading } = useContext(PresentationContext);

  if (slideLoading === slide.id) {
    return (
      <div className={cn('bg-slideBg size-full flex items-center justify-center')}>
        <Loader className={!isPreview ? 'size-24 animate-spin' : 'animate-spin'} />
      </div>
    );
  }

  if (currentElement && currentElement?.slideNumber < slide.slideNumber) {
    return <div className={cn('bg-slideBg size-full flex items-center justify-center')}></div>;
  }

  switch (slide.slideType) {
    case 'title-slide':
      return <TitleSlide slide={!isPresentationSidePreview ? slide : {...slide, dimmedImage: true}} isPreview={isPreview} mobile={mobile} description={description} />;
    case 'content-slide':
      return <ContentsSlide slide={slide} isPreview={isPreview} mobile={mobile} />;
    case 'section-headline-slide':
      return <SectionHeadlineSlide slide={slide} isPreview={isPreview} mobile={mobile} />;
    case 'image-caption-slide':
      return <ImageCaptionSlide slide={slide} isPreview={isPreview} mobile={mobile} />;
    case 'image-text-slide':
      return <ImageTextSlide slide={slide} isPreview={isPreview} mobile={mobile} />;
    case 'screen-slide':
      return <ScreenSlide slide={slide} isPreview={isPreview} />;
    case 'bullet-points-slide':
      return <BulletPointsSlide slide={slide} isPreview={isPreview} mobile={mobile} />;
    case 'chart-slide': {
      const chartSlide = slide as ISlideWithChartData;
      return (
        <ChartSlide
          slide={chartSlide}
          isPreview={isPreview}
          mobile={mobile}
          isPresentationSidePreview={isPresentationSidePreview}
          presentationModeSlideIndex={presentationModeSlideIndex}
        />
      );
    }
    case 'important-text-slide':
      return <ImportantTextSlide slide={slide} isPreview={isPreview} mobile={mobile} />;
    case 'table-slide':
      return <SimpleTable slide={slide} isPreview={isPreview} mobile={mobile} />;
    case 'text-slide':
      return <TextSlide slide={slide} isPreview={isPreview} mobile={mobile} />;
    case 'images-slide':
      return <ImagesSlide slide={slide} isPreview={isPreview} />;
    case 'shapes-slide':
      return <ShapesSlide slide={slide} isPreview={isPreview} mobile={mobile} />;
    case 'closing-slide':
      return <ClosingSlide slide={slide} isPreview={isPreview} mobile={mobile} />;
    case 'free-slide':
      return <FreeSlide slide={slide} isPreview={isPreview} />;
    default:
      return <div></div>;
  }
};

export default SlideFactory;

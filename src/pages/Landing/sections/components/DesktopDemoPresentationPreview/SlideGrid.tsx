import SlidePreview from '@/components/PresentationEditor/Slide/SlidePreview';
import { Skeleton } from '@/components/ui/skeleton';
import { ISlide } from '@/interfaces/ISlides';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

const VISIBLE_SLIDES_COUNT = 3;

type MockSlideType = 'important' | 'image-caption' | 'agenda';

interface MockSlide {
  type: MockSlideType;
  slide: ISlide;
}

function SlideGrid({ slides, theme }: { slides: ISlide[]; theme: string }) {
  const { visibleSlides, mockBlurredSlides } = useMemo(() => {
    const visibleSlides = slides.slice(0, VISIBLE_SLIDES_COUNT);

    const mockBlurredSlides: MockSlide[] = [
      {
        type: 'agenda',
        slide: {
          id: 'mock-image',
          slideNumber: 4,
          slideType: 'content-slide',
          variation: 'default',
          title: 'Agenda',
          titleTranslations: {},
          subtitle: '',
          subtitleTranslations: {},
          accentImage: '',
          accentImageKey: '',
          content: [],
        } as ISlide,
      },
      {
        type: 'image-caption',
        slide: {
          id: 'mock-image',
          slideNumber: 5,
          slideType: 'title-slide',
          variation: 'bottom',
          title: '',
          titleTranslations: {},
          subtitle: '',
          subtitleTranslations: {},
          accentImage: visibleSlides[2]?.accentImage || '',
          accentImageKey: visibleSlides[2]?.accentImageKey || '',
        } as ISlide,
      },
      {
        type: 'important',
        slide: {
          id: 'mock-image',
          slideNumber: 6,
          slideType: 'table-slide',
          variation: 'default',
          title: visibleSlides[2].content[0].text,
          titleTranslations: {},
          subtitle: '',
          subtitleTranslations: {},
          accentImage: '',
          accentImageKey: '',
          content: [],
        } as ISlide,
      },
    ];

    return {
      visibleSlides,
      mockBlurredSlides,
    };
  }, [slides]);
  const getResponsiveClassName = (index: number) =>
    `${index > 0 ? 'hidden sm:block' : ''} ${index > 1 ? 'sm:hidden md:block' : ''}`;

  const renderSlides = () => (
    <>
      {visibleSlides.length > 0
        ? visibleSlides.map((slide, index) => (
            <div
              key={`visible-${index}`}
              className={`overflow-hidden [&>*]:w-full [&>*]:rounded-xl ${getResponsiveClassName(index)}`}
            >
              <SlidePreview slide={slide} className={cn(`demo-preview theme-${theme}`)} />
            </div>
          ))
        : Array.from({ length: VISIBLE_SLIDES_COUNT }, (_, index) => (
            <Skeleton
              key={`skeleton-${index}`}
              className={`outline outline-1 outline-lightGreyHover aspect-video h-full rounded bg-lightGreyPress lg:rounded-2xl ${getResponsiveClassName(index)}`}
            />
          ))}
    </>
  );

  const renderBlurredSlides = () => (
    <>
      {mockBlurredSlides.map((mockSlide, index) => {
        return (
          <div
            key={`blurred-${index}`}
            className={`relative h-12 overflow-hidden ${getResponsiveClassName(index)}`}
          >
            <div className="[&>*]:w-full [&>*]:rounded-xl">
              <SlidePreview
                slide={mockSlide.slide}
                className={cn('demo-preview theme-grey', {
                  'theme-light': mockSlide.type === 'important' && theme === 'light',
                })}
              />
            </div>
          </div>
        );
      })}
    </>
  );

  return (
    <div className="relative mb-6 grid w-full max-w-[280px] grid-cols-1 gap-1 overflow-hidden sm:max-w-full sm:grid-cols-2 sm:gap-2 lg:w-[842px] md:grid-cols-3 lg:gap-3">
      {renderSlides()}
      {renderBlurredSlides()}
      <div className="absolute bottom-0 left-0 h-12 w-full bg-gradient-to-t from-white to-transparent" />
    </div>
  );
}

export default SlideGrid;

import { cn } from '@/lib/utils';
import { ISlide } from '../../../../interfaces/ISlides';
import TextComponent from '../../ContentFactory/TextComponent/TextComponent';
import { Fragment, useContext, useEffect } from 'react';
import { PresentationContext } from '@/contexts/Presentation.context';
import ContentItemComponent from '../../ContentFactory/ContentItemComponent/ContentItemComponent';
import AnimatedText from '../../ContentFactory/TextComponent/AnimatedText';
import { TemplateContext } from '@/contexts/Template.context';
import { handleBackgroundImage } from '@/helpers/utils/images';
import { updateTranslatableField } from '@/helpers/utils/updateTranslatabeField';

const ContentsSlide = ({
  slide,
  isPreview,
  mobile,
}: {
  slide: ISlide;
  isPreview?: boolean;
  mobile?: boolean;
}) => {
  const {
    updateSlide,
    currentElement,
    presentationTemplateInfo,
    selectedLanguage,
    originLanguage,
    presentation,
  } = useContext(PresentationContext);
  const { templateTemplateInfo } = useContext(TemplateContext);

  const templateInfo = presentationTemplateInfo || templateTemplateInfo;

  const hasSecondAgenda =
    presentation &&
    presentation.slides.filter((slide) => slide.slideType === 'content-slide').length === 2;

  const getSlidePosition = () => {
    if (!presentation) return 0;

    if (hasSecondAgenda) {
      const secondAgendaSlides = presentation.slides.filter(
        (slide) => slide.slideType === 'content-slide',
      );

      if (secondAgendaSlides.length >= 2) {
        const firstSlide = secondAgendaSlides[0];
        const secondSlide = secondAgendaSlides[1];

        if (slide.slideNumber === firstSlide.slideNumber) {
          return 0;
        }
        if (slide.slideNumber === secondSlide.slideNumber) {
          return 16;
        }
      }
    }

    return 0;
  };

  const startNumber = getSlidePosition();

  const handleUpdateTitle = (val: string) => {
    const updSlide = updateTranslatableField(
      slide,
      'title',
      val,
      selectedLanguage,
      originLanguage === selectedLanguage,
    );

    updateSlide?.(updSlide);
  };

  useEffect(() => {
    if (!templateInfo) return;

    const timer = setTimeout(() => {
      handleBackgroundImage(slide?.slideType, templateInfo, templateInfo.agendaBg);
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [templateInfo]);

  const filterAdjacentDuplicateTitles = (slide: ISlide) => {
    const filteredContent = [];

    for (let i = 0; i < slide.content.length; i++) {
      if (i === 0) {
        filteredContent.push(slide.content[i]);
      } else {
        if (slide.content[i].text !== slide.content[i - 1].text) {
          filteredContent.push(slide.content[i]);
        }
      }
    }

    return filteredContent;
  };

  const filteredContent = filterAdjacentDuplicateTitles(slide);

  //loading
  if (currentElement && currentElement.slideId === slide.id) {
    return (
      <div className="p-presentation">
        <div
          className={cn('pt-8 sm:pt-contentTop flex size-full', {
            'flex-col': mobile,
          })}
        >
          <div className="w-5/12">
            <AnimatedText
              classNames="text-headline text-heading font-bold font-titleFont"
              text={slide.title}
              skipSwitch={isPreview}
              speed={100}
            />
          </div>
          <div
            className={cn('w-6/12', {
              'w-10/12 grid grid-rows-8 grid-flow-col': slide.content.length > 8 && !mobile,
              'mt-5 w-11/12': mobile,
            })}
          >
            {currentElement.contentId &&
              slide.content?.map((card, index) => {
                if (currentElement.contentId === card.id || currentElement.index >= index) {
                  return (
                    <ContentItemComponent
                      key={`${card.id}-${isPreview?.toString()}`}
                      item={card}
                      totalCount={slide.content.length}
                      index={index}
                      slideId={slide.id}
                      isPreview={isPreview}
                      startPosition={startNumber}
                    />
                  );
                } else {
                  return <Fragment key={index} />;
                }
              })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[inherit] p-presentation">
      <div
        className={cn('pt-8 sm:pt-contentTop flex w-full h-full', {
          'flex-col': mobile,
        })}
      >
        <div className="w-5/12">
          <TextComponent
            className={`font-titleFont ${
              mobile ? 'text-4xl' : 'text-heading'
            } font-bold leading-tight text-headline`}
            content={slide.titleTranslations?.[selectedLanguage] ?? slide.title}
            isPreview={isPreview}
            onUpdate={handleUpdateTitle}
          />
        </div>
        <div
          className={cn('w-6/12 h-full', {
            'w-10/12 grid grid-rows-8 grid-flow-col gap-content':
              filteredContent.length > 8 && !mobile,
            'mt-8 w-11/12': mobile,
          })}
        >
          {filteredContent.map((c, index) => {
            return (
              <ContentItemComponent
                key={`${c.id}-${isPreview?.toString()}`}
                item={c}
                totalCount={filteredContent.length}
                index={index}
                slideId={slide.id}
                isPreview={isPreview}
                startPosition={startNumber}
                mobile={mobile}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ContentsSlide;

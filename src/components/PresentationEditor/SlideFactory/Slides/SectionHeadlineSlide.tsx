import { PresentationContext } from '@/contexts/Presentation.context';
import { useContext, useEffect } from 'react';
import { getSlideVariation } from '../../../../helpers/utils/renderHelpers';
import { ImageFit, ISlide } from '../../../../interfaces/ISlides';
import ImageComponent from '../../ContentFactory/ImageComponent/ImageComponent';
import TextComponent from '../../ContentFactory/TextComponent/TextComponent';
import { mobileVariations, variations } from './variations/section-slide';
import AnimatedText from '../../ContentFactory/TextComponent/AnimatedText';
import { TemplateContext } from '@/contexts/Template.context';
import { handleBackgroundImage } from '@/helpers/utils/images';
import { updateTranslatableField } from '@/helpers/utils/updateTranslatabeField';
import { cn } from '@/lib/utils';

const SectionHeadlineSlide = ({
  slide,
  isPreview,
  mobile,
}: {
  slide: ISlide;
  isPreview?: boolean;
  mobile?: boolean;
}) => {
  const variation = mobile
    ? getSlideVariation(mobileVariations, slide.variation)
    : getSlideVariation(variations, slide.variation);
  const {
    updateSlide,
    currentElement,
    presentationTemplateInfo,
    selectedLanguage,
    originLanguage,
  } = useContext(PresentationContext);
  const { templateTemplateInfo } = useContext(TemplateContext);

  const templateInfo = presentationTemplateInfo || templateTemplateInfo;

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

  const handleImageTransform = (x: number, y: number, scale: number, imageFit: ImageFit) => {
    const updSlide: ISlide = {
      ...slide,
      focusPointX: x,
      focusPointY: y,
      imageFit: imageFit,
      scale,
    };

    updateSlide?.(updSlide);
  };

  useEffect(() => {
    if (!templateInfo) return;

    const timer = setTimeout(() => {
      handleBackgroundImage(slide?.slideType, templateInfo, templateInfo.sectionBg);
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [templateInfo]);

  //loading
  if (slide.title && currentElement && currentElement.slideId === slide.id) {
    return (
      <div className={`flex h-full ${variation?.containerClassName}`}>
        {variation?.imageContainerClassName !== 'hidden' && (
          <div className={variation?.imageContainerClassName}>
            <ImageComponent
              image={slide.accentImage}
              className={variation?.imageClassName}
              isPreview={isPreview}
            />
          </div>
        )}
        <div className={variation?.textContainerClassName}>
          <AnimatedText
            speed={150}
            text={slide.titleTranslations?.[selectedLanguage] ?? slide.title}
            classNames={variation?.plainTextClassName}
            delay={100}
            skipSwitch={isPreview}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex h-full ${(templateInfo?.sectionBg || templateInfo?.roundingSize) && 'bg-transparent'} ${variation?.containerClassName}`}
    >
      {variation?.imageContainerClassName !== 'hidden' && !templateInfo?.sectionBg && (
        <div className={variation?.imageContainerClassName}>
          <ImageComponent
            image={slide.accentImage}
            className={cn(variation?.imageClassName, {
              'opacity-1': !slide.dimmedImage || templateInfo?.sectionBg,
            })}
            isPreview={isPreview}
            align={slide.accentImageAlign}
            onTransform={handleImageTransform}
            slideId={slide.id}
            keywords={slide.accentImageKeyword}
            focusPointX={slide.focusPointX}
            focusPointY={slide.focusPointY}
            imageFit={slide.imageFit}
            currentScale={slide.scale}
          />
        </div>
      )}
      <div
        className={cn(variation?.textContainerClassName, {
          'bg-gradient-to-tr from-transparent via-transparent to-transparent': !slide.dimmedImage,
        })}
      >
        <TextComponent
          className={variation?.plainTextClassName}
          content={slide.titleTranslations?.[selectedLanguage] ?? slide.title}
          isPreview={isPreview}
          onUpdate={handleUpdateTitle}
        />
      </div>
    </div>
  );
};

export default SectionHeadlineSlide;

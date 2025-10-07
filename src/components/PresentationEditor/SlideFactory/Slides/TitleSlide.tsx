import { useContext, useEffect } from 'react';
import { getSlideVariation } from '../../../../helpers/utils/renderHelpers';
import ImageComponent from '../../ContentFactory/ImageComponent/ImageComponent';
import TextComponent from '../../ContentFactory/TextComponent/TextComponent';
import { PresentationContext } from '@/contexts/Presentation.context';
import AnimatedText from '../../ContentFactory/TextComponent/AnimatedText';
import { mobileVariations, variations } from './variations/title-slide';
import { cn } from '@/lib/utils';
import { ImageFit, ISlide } from '@/interfaces/ISlides.ts';
import { TemplateContext } from '@/contexts/Template.context';
import { handleBackgroundImage } from '@/helpers/utils/images';
import { updateTranslatableField } from '@/helpers/utils/updateTranslatabeField';
import TitleBreakline from '@/assets/title-breakline.svg?react';

const TitleSlide = ({
  slide,
  isPreview,
  mobile,
  description
}: {
  slide: ISlide;
  isPreview?: boolean;
  mobile?: boolean;
  description?: string;
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
    presentation,
    updatePresentationDescription,
    isFullscreen
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

  const handleUpdateSubtitle = (val: string) => {
    const updSlide = updateTranslatableField(
      slide,
      'subtitle',
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
      handleBackgroundImage(slide?.slideType, templateInfo, templateInfo.coverBg);
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [templateInfo, slide?.slideType]);

  //loading while generates
  if (slide.title && currentElement && currentElement.slideId === slide.id) {
    return (
      <div
        className={`flex h-full ${
          (templateInfo?.coverBg || templateInfo?.roundingSize) && 'bg-transparent'
        } ${variation?.containerClassName}`}
      >
        {!templateInfo?.hideTitleImage && (
          <div className={cn(variation?.imageContainerClassName)}>
            <ImageComponent
              image={slide.accentImage}
              className={cn(variation?.imageClassName, {
                'opacity-1': !slide.dimmedImage || templateInfo?.coverBg,
              })}
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
        { variation?.type.startsWith('business') && !variation?.type.includes('Without') && 
          <div className={variation?.titleDecoration}>
            <TitleBreakline className={`${isPreview && !isFullscreen ? 'size-1' : 'w-8 h-2'}`}/>
          </div>
        }
        { variation?.type.includes('Subtitle') && 
          <AnimatedText
            speed={150}
            classNames={variation?.subtitleClassName}
            text={slide.subtitleTranslations?.[selectedLanguage] ?? slide.subtitle}
            skipSwitch={isPreview}
            delay={100}
          />
        }
        { presentation?.description && variation?.type.startsWith('business') &&
          <AnimatedText
            speed={150}
            classNames={variation?.plainTextClassName}
            text={presentation.description}
            skipSwitch={isPreview}
            delay={100}
          />
        }
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex h-full ${
        (templateInfo?.coverBg || templateInfo?.roundingSize) && 'bg-transparent'
      } ${variation?.containerClassName}`}
    >
      {!templateInfo?.hideTitleImage && (
        <div className={cn(variation?.imageContainerClassName)}>
          <ImageComponent
            image={slide.accentImage}
            className={cn(variation?.imageClassName, {
              'opacity-1': !slide.dimmedImage || templateInfo?.coverBg,
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
          '[&>*]:pointer-events-auto pointer-events-none': !isPreview,
        })}
      >
        <TextComponent
          className={variation?.slideHeadingClassName}
          content={slide.titleTranslations?.[selectedLanguage] ?? slide.title}
          isPreview={isPreview}
          onUpdate={handleUpdateTitle}
        />
        { variation?.type.startsWith('business') && !variation?.type.includes('Without') && 
          <div className={variation?.titleDecoration}>
            <TitleBreakline className='w-titleDecorationSize'/>
          </div>
        }
        { variation?.type.includes('Subtitle') && 
           <TextComponent
            className={variation?.subtitleClassName}
            content={slide.subtitleTranslations?.[selectedLanguage] ?? slide.subtitle}
            isPreview={isPreview}
            onUpdate={handleUpdateSubtitle}
          />
        }
        { (presentation?.description || description || slide.description) && variation?.type.startsWith('business') &&
          <TextComponent
            className={variation?.plainTextClassName}
            content={presentation?.description || description}
            isPreview={isPreview}
            onUpdate={updatePresentationDescription}
          />
        }
      </div>
    </div>
  );
};

export default TitleSlide;

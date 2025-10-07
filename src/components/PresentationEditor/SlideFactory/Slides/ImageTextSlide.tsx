import { useContext } from 'react';
import { Fragment } from 'react/jsx-runtime';
import { getSlideVariation } from '../../../../helpers/utils/renderHelpers';
import { ImageFit, ISlide } from '../../../../interfaces/ISlides';
import TextComponent from '../../ContentFactory/TextComponent/TextComponent';
import ImageComponent from '../../ContentFactory/ImageComponent/ImageComponent';
import { PresentationContext } from '@/contexts/Presentation.context';
import AnimatedText from '../../ContentFactory/TextComponent/AnimatedText';
import { mobileVariations, variations } from './variations/image-text-slide';
import { updateTranslatableField } from '@/helpers/utils/updateTranslatabeField';

const ImageTextSlide = ({
  slide,
  isPreview,
  mobile,
}: {
  slide: ISlide;
  isPreview?: boolean;
  mobile?: boolean;
}) => {
  const { updateSlide, updateContent, currentElement, selectedLanguage, originLanguage } =
    useContext(PresentationContext);
  const variation = mobile
    ? getSlideVariation(mobileVariations, slide.variation)
    : getSlideVariation(variations, slide.variation);

  const handleUpdateField = (val: string, id: string, field: 'text' | 'title') => {
    const content = slide.content.find((c) => c.id === id);

    if (content) {
      const updContent = updateTranslatableField(
        content,
        field,
        val,
        selectedLanguage,
        originLanguage === selectedLanguage,
      );

      updateContent?.(updContent, slide.id);
    }
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

  //loading
  if (currentElement?.slideId === slide.id) {
    return (
      <div className={variation?.containerClassName}>
        <div className={variation?.imageContainerClassName}>
          <ImageComponent
            image={slide.accentImage}
            className={variation?.imageClassName}
            isPreview={isPreview}
          />
        </div>
        <div className={'size-0 opacity-0'}>
          <AnimatedText
            speed={100}
            text={'1'}
            classNames={variation?.slideHeadingClassName}
            delay={100}
          />
        </div>
        <div className={variation?.textContainerClassName}>
          {currentElement.contentId &&
            slide.content?.map((content) => {
              if (currentElement?.contentId === content.id)
                return (
                  <Fragment key={content.id}>
                    <div className={variation?.verticalLayout ? 'w-1/2' : 'w-full'}>
                      <AnimatedText
                        speed={100}
                        text={content.titleTranslations?.[selectedLanguage] ?? content.title ?? ''}
                        classNames={variation?.slideHeadingClassName}
                        skipSwitch
                      />
                    </div>
                    <div className={variation?.verticalLayout ? 'w-1/2' : 'w-full'}>
                      <AnimatedText
                        speed={15}
                        text={content.textTranslations?.[selectedLanguage] ?? content.text ?? ''}
                        classNames={variation?.plainTextClassName}
                        delay={200}
                        skipSwitch={isPreview}
                      />
                    </div>
                  </Fragment>
                );
            })}
        </div>
      </div>
    );
  }

  return (
    <div className={variation?.containerClassName}>
      <div className={variation?.imageContainerClassName}>
        <ImageComponent
          image={slide.accentImage}
          className={variation?.imageClassName}
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
      <div className={variation?.textContainerClassName}>
        {slide.content?.map((content) => {
          return (
            <Fragment key={content.id}>
              <div className={variation?.verticalLayout ? 'w-5/12' : 'w-full'}>
                <TextComponent
                  className={variation?.slideHeadingClassName}
                  content={content.titleTranslations?.[selectedLanguage] ?? content.title}
                  isPreview={isPreview}
                  onUpdate={(val) => handleUpdateField(val, content.id, 'title')}
                />
              </div>
              <div className={variation?.verticalLayout ? 'w-6/12' : 'w-full'}>
                <TextComponent
                  className={variation?.plainTextClassName}
                  content={content.textTranslations?.[selectedLanguage] ?? content.text}
                  isPreview={isPreview}
                  onUpdate={(val) => handleUpdateField(val, content.id, 'text')}
                />
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ImageTextSlide;

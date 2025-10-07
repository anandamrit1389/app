import { useContext } from 'react';
import { getSlideVariation } from '../../../../helpers/utils/renderHelpers';
import { ISlide } from '../../../../interfaces/ISlides';
import TextComponent from '../../ContentFactory/TextComponent/TextComponent';
import { PresentationContext } from '@/contexts/Presentation.context';
import AnimatedText from '../../ContentFactory/TextComponent/AnimatedText';
import { variations } from './variations/screen-slide';
import { updateTranslatableField } from '@/helpers/utils/updateTranslatabeField';
import ImageComponent from '../../ContentFactory/ImageComponent/ImageComponent';

const ScreenSlide = ({
  slide,
  isPreview,
}: {
  slide: ISlide;
  isPreview?: boolean;
}) => {
  const variation = getSlideVariation(variations, slide.variation);
  const { updateSlide, currentElement, selectedLanguage, originLanguage, updateContent } = useContext(PresentationContext);

  const handleUpdateField = (val: string, field: 'title' | 'subtitle') => {
    const updSlide = updateTranslatableField(
      slide,
      field,
      val,
      selectedLanguage,
      originLanguage === selectedLanguage,
    );

    updateSlide?.(updSlide);
  };

  const handleUpdateContent = (val: string, id: string, field: 'title' | 'text') => {
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

  // During loading/generation state
  if (currentElement?.slideId === slide.id) {
    return (
      <div className={variation?.pageContainerClassName}>
        <AnimatedText
          classNames={variation?.slideHeadingClassName}
          text={slide.titleTranslations?.[selectedLanguage] ?? slide.title ?? ''}
          speed={20}
          skipSwitch={isPreview}
        />
        <div className={variation?.containerClassName}>
          <div className={variation?.imageContainerClassName}>
            <ImageComponent
              image={slide.accentImage}
              className={variation?.imageClassName}
              isPreview={isPreview}
              align={slide.accentImageAlign}
              slideId={slide.id}
              keywords={slide.accentImageKeyword}
              focusPointX={slide.focusPointX}
              focusPointY={slide.focusPointY}
              imageFit={slide.imageFit}
              currentScale={slide.scale}
            />
          </div>
          {variation?.type !== 'center' && (
            <div className={variation?.subTextContainerClassName}>
              {slide.content?.map((content, index) => {
                return (
                  <div key={content.id} className={`${index === 0 ? 'row-span-2' : ''}`}>
                    <AnimatedText
                      classNames={`${variation?.plainTextClassName}`}
                      text={content.textTranslations?.[selectedLanguage] ?? content?.text}
                      speed={20}
                      skipSwitch={isPreview}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Normal render state
  return (
    <div className={variation?.pageContainerClassName}>
      <TextComponent 
        isPreview={isPreview}
        className={`${variation?.slideHeadingClassName}`}
        content={slide.titleTranslations?.[selectedLanguage] ?? slide?.title}
        onUpdate={(val) => handleUpdateField(val, 'title')}
      />
      <div className={variation?.containerClassName}>
        <div className={variation?.imageContainerClassName}>
          <div className={`border border-black border-opacity-20 ${(variation?.type === 'top' || variation?.type === 'bottom') && "h-full w-1/2"}`}>
            <ImageComponent
              image={slide.accentImage}
              className={variation?.imageClassName}
              isPreview={isPreview}
              align={slide.accentImageAlign}
              slideId={slide.id}
              keywords={slide.accentImageKeyword}
              focusPointX={slide.focusPointX}
              focusPointY={slide.focusPointY}
              imageFit={slide.imageFit}
              currentScale={slide.scale}
            />
          </div>
        </div>
        {variation?.type !== 'center' && (
          <div className={variation?.subTextContainerClassName}>
            {slide.content?.map((content) => {
              return (
                <div key={content.id} >
                  <TextComponent
                    isPreview={isPreview}
                    className={`${variation?.plainTextClassName}`}
                    content={content.textTranslations?.[selectedLanguage] ?? content?.text}
                    onUpdate={(val) => handleUpdateContent(val, content.id, 'text')}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScreenSlide;

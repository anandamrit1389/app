import { ISlide } from '@/interfaces/ISlides';
import TextComponent from '../../ContentFactory/TextComponent/TextComponent';
import { getSlideVariation } from '@/helpers/utils/renderHelpers';
import { PresentationContext } from '@/contexts/Presentation.context';
import { Fragment, useContext } from 'react';
import AnimatedText from '../../ContentFactory/TextComponent/AnimatedText';
import { mobileVariations, variations } from './variations/text-slide';
import { updateTranslatableField } from '@/helpers/utils/updateTranslatabeField';

const TextSlide = ({
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
  const { updateSlide, updateContent, currentElement, selectedLanguage, originLanguage } =
    useContext(PresentationContext);

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

  //lodaing
  if (currentElement && currentElement.slideId === slide.id) {
    return (
      <div className="p-4 sm:p-presentation">
        <div className={`${variation?.containerClassName}`}>
          <div className={variation?.pageContainerClassName}>
            <AnimatedText
              skipSwitch={isPreview}
              classNames={variation?.slideHeadingClassName}
              text={slide.titleTranslations?.[selectedLanguage] ?? slide.title}
              speed={40}
            />
            {slide.subtitle && (
              <AnimatedText
                skipSwitch
                classNames={variation?.subtitleClassName}
                text={slide.subtitleTranslations?.[selectedLanguage] ?? slide.subtitle}
                speed={10}
                delay={100}
              />
            )}
          </div>
          <div className={variation?.textContainerClassName}>
            {currentElement.contentId &&
              slide.content?.map((content, index) => {
                if (currentElement.contentId === content.id || currentElement.index >= index) {
                  return (
                    <div key={content.id} className={`${index === 0 ? 'row-span-2' : ''}`}>
                      <AnimatedText
                        skipSwitch
                        classNames={variation?.contentSubtitleClassName}
                        text={
                          content.titleTranslations?.[selectedLanguage] ?? (content.title || '.')
                        }
                        speed={40}
                      />
                      <AnimatedText
                        skipSwitch={isPreview}
                        classNames={`${variation?.plainTextClassName}`}
                        text={
                          content.textTranslations?.[selectedLanguage] ?? content?.text ?? '...'
                        }
                        speed={5}
                        delay={100}
                      />
                    </div>
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
    <div className="p-4 sm:p-presentation">
      <div className={`${variation?.containerClassName}`}>
        <div className={variation?.pageContainerClassName}>
          <TextComponent
            isPreview={isPreview}
            className={variation?.slideHeadingClassName}
            content={slide.titleTranslations?.[selectedLanguage] ?? slide.title}
            onUpdate={(val) => handleUpdateField(val, 'title')}
          />
          {slide.subtitle && (
            <TextComponent
              isPreview={isPreview}
              className={variation?.subtitleClassName}
              content={slide.subtitleTranslations?.[selectedLanguage] ?? slide.subtitle}
              onUpdate={(val) => handleUpdateField(val, 'subtitle')}
            />
          )}
        </div>
        <div className={variation?.textContainerClassName}>
          {slide.content?.map((content, index) => {
            return (
              <div key={content.id} className={`${index === 0 ? 'row-span-2' : ''}`}>
                <TextComponent
                  isPreview={isPreview}
                  className={variation?.contentSubtitleClassName}
                  content={content.titleTranslations?.[selectedLanguage] ?? content.title}
                  onUpdate={(val) => handleUpdateContent(val, content.id, 'title')}
                />
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
      </div>
    </div>
  );
};

export default TextSlide;

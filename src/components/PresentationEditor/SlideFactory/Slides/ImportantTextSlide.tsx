import { Fragment, useContext } from 'react';
import { PresentationContext } from '@/contexts/Presentation.context';
import { getSlideVariation } from '../../../../helpers/utils/renderHelpers';
import { ISlide } from '../../../../interfaces/ISlides';
import TextComponent from '../../ContentFactory/TextComponent/TextComponent';
import AnimatedText from '../../ContentFactory/TextComponent/AnimatedText';
import { mobileVariations, variations } from './variations/important-text-slide';
import { updateTranslatableField } from '@/helpers/utils/updateTranslatabeField';

const ImportantTextSlide = ({
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

  const handleUpdateContent = (val: string, id: string) => {
    const content = slide.content.find((c) => c.id === id);

    if (content) {
      const updContent = updateTranslatableField(
        content,
        'text',
        val,
        selectedLanguage,
        originLanguage === selectedLanguage,
      );

      updateContent?.(updContent, slide.id);
    }
  };

  //loading
  if (currentElement && currentElement.slideId === slide.id) {
    return (
      <div className={`p-presentation ${variation?.containerClassName}`}>
        <div className={variation?.textContainerClassName}>
          <AnimatedText
            skipSwitch={isPreview}
            classNames={variation?.slideHeadingClassName}
            text={slide.titleTranslations?.[selectedLanguage] ?? slide.title}
            speed={50}
          />
        </div>
        {currentElement.contentId &&
          slide.content?.map((content, index) => {
            if (currentElement.contentId === content.id || currentElement.index >= index) {
              return (
                <AnimatedText
                  key={content.id}
                  skipSwitch={isPreview}
                  classNames={variation?.plainTextClassName}
                  text={content.textTranslations?.[selectedLanguage] ?? content?.text ?? '.'}
                  speed={20}
                />
              );
            } else {
              return <Fragment key={index} />;
            }
          })}
      </div>
    );
  }

  return (
    <div className={`p-presentation pt-10 sm:pt-presentation ${variation?.containerClassName}`}>
      <div className={variation?.textContainerClassName}>
        <TextComponent
          isPreview={isPreview}
          className={variation?.slideHeadingClassName}
          content={slide.titleTranslations?.[selectedLanguage] ?? slide.title}
          onUpdate={handleUpdateTitle}
        />
      </div>
      {slide.content?.map((content) => {
        return (
          <TextComponent
            key={content.id}
            className={variation?.plainTextClassName}
            content={content.textTranslations?.[selectedLanguage] ?? content?.text}
            isPreview={isPreview}
            onUpdate={(val) => handleUpdateContent(val, content.id)}
          />
        );
      })}
    </div>
  );
};

export default ImportantTextSlide;

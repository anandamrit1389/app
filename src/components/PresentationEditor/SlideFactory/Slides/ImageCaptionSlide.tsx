import { Fragment, useContext } from 'react';
import { PresentationContext } from '@/contexts/Presentation.context';
import { getSlideVariation } from '../../../../helpers/utils/renderHelpers';
import { ISlide } from '../../../../interfaces/ISlides';
import CardComponent from '../../ContentFactory/CardComponent/CardComponent';
import TextComponent from '../../ContentFactory/TextComponent/TextComponent';
import { IContent } from '@/interfaces/ISlides';
import AnimatedText from '../../ContentFactory/TextComponent/AnimatedText';
import { mobileVariations, variations } from './variations/image-caption-slide';
import { updateTranslatableField } from '@/helpers/utils/updateTranslatabeField';

const ImageCaptionSlide = ({
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
  const { updateContent, updateSlide, currentElement, selectedLanguage, originLanguage } =
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

  const handleUpdateCard = (val: IContent) => {
    updateContent?.(val, slide.id);
  };

  //loading
  if (currentElement && currentElement.slideId === slide.id) {
    return (
      <div className="relative flex size-full flex-col items-center justify-center">
        <AnimatedText
          classNames={variation?.slideHeadingClassName}
          text={
            variation?.slideHeadingClassName?.includes('hidden')
              ? '.'
              : (slide.titleTranslations?.[selectedLanguage] ?? slide.title)
          }
          speed={100}
          delay={200}
          skipSwitch={isPreview}
        />

        <div
          className={`flex ${mobile ? 'flex-col' : ''} gap-presentation p-presentation ${
            slide.variation === 'full' ? 'size-full' : ''
          }`}
        >
          {currentElement.contentId &&
            slide.content?.map((card, index) => {
              if (currentElement.contentId === card.id || currentElement.index >= index) {
                return (
                  <CardComponent
                    horizontal={variation?.type !== 'full' || slide.content.length > 2}
                    mobile={mobile}
                    key={`${card.id}_${card.sortOrder}`}
                    card={card}
                    variation={variation}
                    index={index}
                    totalCount={slide.content.length}
                    isPreview={isPreview}
                    onUpdateContent={handleUpdateCard}
                    slideId={slide.id}
                    ignorePadding
                  />
                );
              } else {
                return <Fragment key={index} />;
              }
            })}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative flex size-full flex-col overflow-y-auto ${
        mobile ? 'px-presentation pt-8 sm:p-presentation ' : 'items-center justify-center '
      }`}
    >
      <TextComponent
        className={variation?.slideHeadingClassName}
        content={slide.titleTranslations?.[selectedLanguage] ?? slide.title}
        isPreview={isPreview}
        onUpdate={handleUpdateTitle}
      />

      <div
        className={`flex ${mobile ? 'flex-col' : 'gap-presentation p-presentation'}  ${
          slide.variation === 'full' ? 'size-full' : 'w-full'
        }`}
      >
        {slide.content?.map((card, index) => {
          return (
            <CardComponent
              horizontal={variation?.type !== 'full' || slide.content.length > 2}
              mobile={mobile}
              key={`${card.id}_${card.sortOrder}`}
              card={card}
              variation={variation}
              index={index}
              totalCount={slide.content.length}
              isPreview={isPreview}
              onUpdateContent={handleUpdateCard}
              slideId={slide.id}
              ignorePadding
            />
          );
        })}
      </div>
    </div>
  );
};

export default ImageCaptionSlide;

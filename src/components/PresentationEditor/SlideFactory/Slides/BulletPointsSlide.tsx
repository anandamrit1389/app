import { Fragment, useContext } from 'react';
import { PresentationContext } from '@/contexts/Presentation.context';
import { getSlideVariation } from '../../../../helpers/utils/renderHelpers';
import { ImageFit, ISlide } from '../../../../interfaces/ISlides';
import TextComponent from '../../ContentFactory/TextComponent/TextComponent';
import BulletPointComponent from '../../ContentFactory/BulletPointComponent/BulletPointComponent';
import AnimatedText from '../../ContentFactory/TextComponent/AnimatedText';
import { listVariations, mobileVariations } from './variations/bullets-slide';
import ImageComponent from '../../ContentFactory/ImageComponent/ImageComponent';
import { updateTranslatableField } from '@/helpers/utils/updateTranslatabeField';

const BulletPointsSlide = ({
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
    : getSlideVariation(listVariations, slide.variation);
  const { updateSlide, updateContent, currentElement, selectedLanguage, originLanguage } =
    useContext(PresentationContext);

  const handleUpdateField = (val: string, field: 'title' | 'subtitle') => {
    let updSlide = updateTranslatableField(
      slide,
      field,
      val,
      selectedLanguage,
      originLanguage === selectedLanguage,
    );
    
    if (field === 'subtitle' && !val) {
      updSlide = { ...updSlide, variation: `${variation?.type}-without-subtitle` };
    }

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
  if (currentElement && currentElement.slideId === slide.id) {
    return (
      <div className={`${variation?.layoutContainerClassName}`}>
        <div className={variation?.pageContainerClassName}>
          <AnimatedText
            classNames={variation?.slideHeadingClassName}
            text={variation?.slideHeadingClassName?.includes('hidden') ? '.' : slide.title}
            speed={20}
            skipSwitch={isPreview}
          />
          <AnimatedText
            classNames={variation?.subtitleClassName}
            text={
              variation?.slideHeadingClassName?.includes('hidden') ? '.' : (slide.subtitle ?? '')
            }
            speed={10}
            delay={50}
            skipSwitch
          />
          <div className={variation?.containerClassName}>
            {currentElement.contentId &&
              slide.content.map((item, index) => {
                if (currentElement.contentId === item.id || currentElement.index >= index) {
                  return (
                    <BulletPointComponent
                      key={index}
                      item={item}
                      totalCount={slide.content.length}
                      index={index}
                      slideId={slide.id}
                      variation={variation}
                      isPreview={isPreview}
                    />
                  );
                } else {
                  return <Fragment key={index} />;
                }
              })}
          </div>
        </div>
        <div className={variation?.imageContainerClassName}>
          <ImageComponent
            image={slide.accentImage ?? 'broken'}
            className={variation?.imageClassName}
            isPreview={isPreview}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`${variation?.layoutContainerClassName}`}>
      <div className={variation?.pageContainerClassName}>
        <div>
          <TextComponent
            className={variation?.slideHeadingClassName}
            content={slide.titleTranslations?.[selectedLanguage] ?? slide.title}
            isPreview={isPreview}
            onUpdate={(val) => handleUpdateField(val, 'title')}
          />
          <TextComponent
            className={variation?.subtitleClassName}
            content={slide.subtitleTranslations?.[selectedLanguage] ?? slide.subtitle}
            isPreview={isPreview}
            onUpdate={(val) => handleUpdateField(val, 'subtitle')}
          />
        </div>
        <div className={variation?.containerClassName}>
          {slide.content.map((item, index) => {
            return (
              <BulletPointComponent
                key={index + item.id}
                onUpdateContent={handleUpdateContent}
                item={item}
                totalCount={slide.content.length}
                index={index}
                slideId={slide.id}
                variation={variation}
                isPreview={isPreview}
                mobile={mobile}
              />
            );
          })}
        </div>
      </div>
      <div className={variation?.imageContainerClassName}>
        <ImageComponent
          image={slide.accentImage ?? 'broken'}
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
    </div>
  );
};

export default BulletPointsSlide;

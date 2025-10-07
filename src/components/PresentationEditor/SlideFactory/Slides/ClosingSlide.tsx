import { ImageFit, ISlide } from '../../../../interfaces/ISlides';
import TextComponent from '../../ContentFactory/TextComponent/TextComponent';
import { Fragment, useContext } from 'react';
import { PresentationContext } from '@/contexts/Presentation.context';
import ImageComponent from '../../ContentFactory/ImageComponent/ImageComponent';
import { getSlideVariation } from '@/helpers/utils/renderHelpers';
import { ISlideVariation } from '@/interfaces/ISlideVariation';
import AnimatedText from '../../ContentFactory/TextComponent/AnimatedText';
import { updateTranslatableField } from '@/helpers/utils/updateTranslatabeField';

const ClosingSlide = ({
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

  const handleUpdateContent = (val: string, id: string, field: 'title' | 'subtitle') => {
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

  // const handleProfileImageUpdate = (
  //   val: { imageUrl: string; imageKey: string },
  //   id: string
  // ) => {
  //   const content = slide.content.find((c) => c.id === id);

  //   if (content) {
  //     const updContent = {
  //       ...content,
  //       image: val.imageUrl,
  //       imageKey: val.imageKey,
  //     };

  //     updateContent(updContent, slide.id);
  //   }
  // };

  const profileContent = slide.content[0];

  //loading
  if (currentElement?.slideId === slide.id) {
    return (
      <div className={variation?.containerClassName}>
        <div className={variation?.imageContainerClassName}>
          <ImageComponent
            image={slide.accentImage}
            className={variation?.imageClassName}
            isPreview={isPreview}
            focusPointX={slide.focusPointX}
            focusPointY={slide.focusPointY}
          />
        </div>
        <div className={variation?.textContainerClassName}>
          <div className={variation?.verticalLayout ? 'w-1/2' : 'w-full'}>
            <AnimatedText
              speed={100}
              text={slide.titleTranslations?.[selectedLanguage] ?? slide.title}
              classNames={variation?.slideHeadingClassName}
              delay={100}
            />
          </div>

          <div className={variation?.subTextContainerClassName}>
            {profileContent && (
              <div>
                <Fragment key={profileContent.id}>
                  <div className={variation?.verticalLayout ? 'w-1/2' : 'w-full'}>
                    <AnimatedText
                      speed={100}
                      text={profileContent.title ?? '.'}
                      classNames={variation?.slideHeadingClassName}
                      skipSwitch
                    />
                  </div>
                  <div className={variation?.subTextContainerClassName}>
                    <AnimatedText
                      speed={15}
                      text={
                        profileContent.subtitleTranslations?.[selectedLanguage] ??
                        profileContent.subtitle ??
                        '.'
                      }
                      classNames={variation?.plainTextClassName}
                      delay={200}
                      skipSwitch={isPreview}
                    />
                  </div>
                </Fragment>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={variation?.containerClassName}>
      <div className={variation?.imageContainerClassName}>
        <ImageComponent
          image={slide.accentImage ? slide.accentImage : ''}
          className={`${variation?.imageClassName}`}
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
        <div className={variation?.verticalLayout ? 'w-1/2' : 'w-full'}>
          <TextComponent
            className={variation?.slideHeadingClassName}
            content={slide.titleTranslations?.[selectedLanguage] ?? slide.title}
            isPreview={isPreview}
            onUpdate={handleUpdateTitle}
          />
        </div>

        <div className={variation?.subTextContainerClassName}>
          {profileContent && (
            <div>
              {profileContent.image && (
                <ImageComponent
                  className={'aspect-square h-maxIconHeight'}
                  image={profileContent.image}
                  isPreview={isPreview}
                  align={profileContent.imageAlign}
                  slideId={slide.id}
                  contentId={profileContent.id}
                  keywords={profileContent.imageKeyword}
                  isCircular={true}
                  focusPointX={profileContent.focusPointX}
                  focusPointY={profileContent.focusPointY}
                  currentScale={profileContent.scale}
                />
              )}

              <div className={variation?.verticalLayout ? 'w-1/2' : 'w-full'}>
                <TextComponent
                  className={variation?.subtitleClassName}
                  showPromActions={false}
                  content={
                    slide.variation === 'left'
                      ? (profileContent.titleTranslations?.[selectedLanguage] ??
                        profileContent.title)
                      : profileContent.text
                  }
                  isPreview={isPreview}
                  onUpdate={(val) => handleUpdateContent(val, profileContent.id, 'title')}
                />
              </div>
              <div className={variation?.subTextClassName}>
                <TextComponent
                  content={
                    profileContent.subtitleTranslations?.[selectedLanguage] ??
                    profileContent.subtitle
                  }
                  showPromActions={false}
                  isPreview={isPreview}
                  onUpdate={(val) => handleUpdateContent(val, profileContent.id, 'subtitle')}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClosingSlide;

export const variations: ISlideVariation[] = [
  {
    type: 'left',
    containerClassName: 'flex size-full',
    imageContainerClassName: 'w-1/2 object-cover',
    textContainerClassName: 'w-1/2 p-presentation mt-contentTop',
    imageClassName: 'object-cover size-full',
    plainTextClassName: 'text-normalText text-normalTextFontSize',
    slideHeadingClassName:
      'font-titleFont text-title font-extrabold leading-tight tracking-tight text-headline',
    subtitleClassName: 'm-0 font-titleFont text-base text-normalText sm:text-subheadline',
    subTextContainerClassName: 'flex',
    subTextClassName:
      'font-bodyFont text-base text-smallText sm:text-smallSubHeadlineSize flex grow items-center justify-center',
  },
  {
    type: 'top',
    containerClassName: 'flex size-full flex-col',
    imageContainerClassName: 'w-full h-2/3',
    textContainerClassName: 'w-full h-1/3 flex p-presentation overflow-hidden',
    imageClassName: 'object-cover size-full',
    plainTextClassName: 'text-normalText text-normalTextFontSize w-11/12 font-bodyFont h-full',
    slideHeadingClassName:
      'text-headline font-bold text-smallHeading mb-content w-11/12 font-titleFont',
    subtitleClassName: 'text-normalText text-normalTextFontSize w-11/12 font-bodyFont h-full',
    subTextContainerClassName: 'w-1/2',
    subTextClassName:
      'font-bodyFont text-base text-smallText sm:text-smallSubHeadlineSize flex grow items-center justify-center',
    verticalLayout: true,
  },
];

export const mobileVariations: ISlideVariation[] = [
  {
    type: 'default',
    containerClassName: 'flex flex-col size-full',
    imageContainerClassName: 'w-full h-1/3',
    textContainerClassName: 'w-full h-2/3 p-presentation mt-contentTop',
    imageClassName: 'object-cover size-full',
    plainTextClassName: 'text-normalText text-normalTextFontSize',
    slideHeadingClassName: 'text-titleText font-bold text-smallHeading mb-content',
  },
];

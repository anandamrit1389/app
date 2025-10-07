import { ISlideVariation } from '@/interfaces/ISlideVariation';
import { ISlide } from '@/interfaces/ISlides';
import TextComponent from '../../ContentFactory/TextComponent/TextComponent';

import './additional-styles.css';
import { PresentationContext } from '@/contexts/Presentation.context';
import { Fragment, useContext } from 'react';
import classNames from 'classnames';
import AnimatedText from '../../ContentFactory/TextComponent/AnimatedText';
import { updateTranslatableField } from '@/helpers/utils/updateTranslatabeField';

const ShapesSlide = ({
  slide,
  isPreview,
  mobile,
}: {
  slide: ISlide;
  isPreview?: boolean;
  mobile?: boolean;
}) => {
  const variation = listVariations[0];
  const {
    updateSlide,
    updateContent,
    currentElement,
    presentationTemplateInfo: templateInfo,
    selectedLanguage,
    originLanguage,
  } = useContext(PresentationContext);

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

  const handleUpdateContent = (val: string, id: string, field: 'title' | 'text' | 'subtitle') => {
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

  //loading
  if (currentElement && currentElement.slideId === slide.id) {
    return (
      <div className="p-presentation">
        <div className={variation?.pageContainerClassName}>
          <AnimatedText
            classNames={variation?.slideHeadingClassName}
            text={
              variation?.slideHeadingClassName?.includes('hidden')
                ? '.'
                : (slide.titleTranslations?.[selectedLanguage] ?? slide.title)
            }
            speed={100}
            skipSwitch={isPreview}
          />
          <AnimatedText
            classNames={variation?.subtitleClassName}
            text={
              variation?.slideHeadingClassName?.includes('hidden')
                ? '.'
                : (slide.subtitleTranslations?.[selectedLanguage] ?? slide.subtitle ?? '.')
            }
            speed={80}
            delay={200}
            skipSwitch
          />
        </div>
        <div
          className={classNames(variation?.containerClassName, {
            'grid-cols-1': mobile,
            'grid-cols-3': !mobile,
          })}
        >
          {currentElement.contentId &&
            slide.content.map((item, index) => {
              if (currentElement.contentId === item.id || currentElement.index >= index) {
                return (
                  <div className={classNames('flex')} key={item.id}>
                    <div
                      className={`rounded-l-lg ${
                        !templateInfo?.sectionBg &&
                        'border-y-shapeBorderSize border-l-shapeBorderSizeSmall border-y-transparent border-l-pageBg'
                      } bg-shape`}
                    ></div>
                    <div className={`${variation?.textContainerClassName}`}>
                      <AnimatedText
                        classNames={variation?.contentSubtitleClassName}
                        text={`${item.sortOrder} ${
                          item.subtitleTranslations?.[selectedLanguage] ?? item.subtitle
                        }`}
                        speed={80}
                        skipSwitch
                      />
                      <AnimatedText
                        classNames={variation?.plainTextClassName}
                        text={item.textTranslations?.[selectedLanguage] ?? item.text ?? '.'}
                        speed={20}
                        delay={300}
                        skipSwitch={isPreview}
                      />
                    </div>
                    <div
                      className={`rounded ${
                        !templateInfo?.sectionBg &&
                        'border-y-shapeBorderSize border-l-shapeBorderSizeSmall border-y-pageBg border-l-shape'
                      } bg-shape`}
                    ></div>
                  </div>
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
    <div className={`p-presentation ${mobile ? 'pt-8' : ''}`}>
      <div className={variation?.pageContainerClassName}>
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
      <div
        className={classNames(variation?.containerClassName, {
          'grid-cols-1': mobile,
          'grid-cols-3': !mobile,
        })}
      >
        {slide.content.map((item) => {
          return (
            <div className={classNames('flex')} key={item.id}>
              <div
                className={`rounded-l-lg ${
                  !templateInfo?.sectionBg &&
                  'border-y-shapeBorderSize border-l-shapeBorderSizeSmall border-y-transparent border-l-pageBg'
                } bg-shape`}
              ></div>
              <div className={`${variation?.textContainerClassName}`}>
                <TextComponent
                  className={variation?.contentSubtitleClassName}
                  content={`${item.sortOrder} ${
                    item.subtitleTranslations?.[selectedLanguage] ?? item?.subtitle
                  }`}
                  isPreview={isPreview}
                  onUpdate={(val) => handleUpdateContent(val, item.id, 'subtitle')}
                />
                <TextComponent
                  className={variation?.plainTextClassName}
                  content={item.textTranslations?.[selectedLanguage] ?? item?.text}
                  isPreview={isPreview}
                  onUpdate={(val) => handleUpdateContent(val, item.id, 'text')}
                />
              </div>
              <div
                className={`rounded ${
                  !templateInfo?.sectionBg &&
                  'border-y-shapeBorderSize border-l-shapeBorderSizeSmall border-y-pageBg border-l-shape'
                } bg-shape`}
              ></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShapesSlide;

const listVariations: ISlideVariation[] = [
  {
    type: 'two-rows',
    plainTextClassName: 'text-normalTextFontSize text-shapeText w-10/12 arrow-text font-bodyFont',
    subtitleClassName: 'text-normalText text-subheadline w-8/12 font-titleFont',
    slideHeadingClassName: 'text-headline font-bold text-smallHeading mb-content font-titleFont',
    textContainerClassName:
      'bg-shape flex items-center p-content w-full rounded-r arrow-shape font-bodyFont',
    containerClassName: 'grid gap-content pt-presentation',
    contentSubtitleClassName: 'hidden',
    pageContainerClassName: 'pt-contentTop',
    showOrderNumber: true,
  },
];

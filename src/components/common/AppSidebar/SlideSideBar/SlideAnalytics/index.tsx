import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { PresentationContext } from '@/contexts/Presentation.context';
import { AnalyticsContext } from '@/contexts/Analytics.context';
import Loader from '@/assets/loader-color.svg?react';
import { TextFixItem } from './TextFixItem';
import { ImageFixItem } from './ImageFixItem';
import { SlideFixItemBase } from './SlideFixItemBase';
import { SimpleFixItem } from './SimpleFixItem';
import { ISlide, SlideTypes } from '@/interfaces/ISlides';

const SlideAnalytics = () => {
  const { handleShowMeSelectedText, activeSlide, showSideBar, setActiveImage, updateSlide } =
    useContext(PresentationContext);
  const {
    loading,
    handleFix,
    loadElement,
    handleFixAllSlide,
    handleRemoveImprovement,
    getSlideImprovements,
    isSlideParsed,
  } = useContext(AnalyticsContext);

  const activeSlideImprovements = getSlideImprovements(activeSlide?.slideNumber);

  const isParsed = isSlideParsed(activeSlide?.slideNumber);

  const { t } = useTranslation('translation', { keyPrefix: 'analytics' });

  const handleOpenImageOptionSidebar = (slideId: string, contentId?: string) => {
    showSideBar('webimages');
    setActiveImage({ slideId, contentId });
  };

  const handleChangeLayout = (slide: ISlide, newType?: SlideTypes, newVariant?: string) => {
    if (!slide) return;
    
    if (newType && newVariant) {
      const updatedSlide = { ...slide, slideType: newType, variation: newVariant };
      updateSlide(updatedSlide);
      if (activeSlide?.slideNumber) {
        activeSlideImprovements.forEach((r) => {
          if (r.result.type === 'text' && r.result.result === 'longText') {
            handleRemoveImprovement(r.slideId, r.slideNumber, r.result.resultId);
          }
        });
      }
      return;
    }
    
    if (slide.slideType === 'image-text-slide') {
      if (!slide.variation.includes('1/3')) {
        const newVariation = 'left-1/3';
        const updatedSlide = { ...slide, variation: newVariation };
        updateSlide(updatedSlide);
        if (activeSlide?.slideNumber) {
          activeSlideImprovements.forEach((r) => {
            if (r.result.type === 'text' && r.result.result === 'longText') {
              handleRemoveImprovement(r.slideId, r.slideNumber, r.result.resultId);
            }
          });
        }
      }
    }
  };

  // const handleUpscale = (result: IImageResult, index: number) => {
  //   if (result.resultId.endsWith('.webp')) {
  //     toast.error(t('noWebpSupport'));
  //     return;
  //   }
  //   onUpscale(result, index);
  // };

  if (loading) {
    return (
      <div className="flex size-full items-center justify-center">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  if (activeSlideImprovements && activeSlideImprovements.length > 0) {
    return (
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col divide-y overflow-y-auto overflow-x-hidden">
          {activeSlideImprovements.map((r, index) => {
            switch (r.result.type) {
              case 'text':
                return (
                  <TextFixItem
                    key={`${r.result.type}_${r.result.resultId}`}
                    loading={loadElement.includes(r.result.resultId)}
                    result={r.result}
                    onShowMeSelectedText={() =>
                      handleShowMeSelectedText(r.slideId, r.result.resultId)
                    }
                    onFix={() => {
                      handleFix(r, index);
                    }}
                    onRemove={() => {
                      handleRemoveImprovement(r.slideId, r.slideNumber, r.result.resultId);
                    }}
                    onChangeLayout={(newType, newVariant) => {
                      const slide = activeSlide;
                      if (slide && r.result.result === 'longText') {
                        handleChangeLayout(slide, newType, newVariant);
                      }
                    }}
                    slide={activeSlide}
                  />
                );
              case 'image':
                return (
                  <ImageFixItem
                    key={r.result.type}
                    result={r.result}
                    loading={loadElement.includes(r.result.resultId)}
                    onRemove={() => {
                      handleRemoveImprovement(r.slideId, r.slideNumber, r.result.resultId);
                    }}
                    onUpscale={undefined}
                    onOpenImageOptionSidebar={() =>
                      handleOpenImageOptionSidebar(r.slideId, r.result.contentId)
                    }
                  />
                );
              case 'unparsed_image':
                return (
                  <SlideFixItemBase
                    key={r.result.type}
                    item={{
                      color: r.result.color,
                      title: t(`${r.result.result}.title`),
                      description: t(`${r.result.result}.description`),
                    }}
                    onRemove={() => {
                      handleRemoveImprovement(r.slideId, r.slideNumber, r.result.resultId);
                    }}
                  />
                );
              case 'bullets':
              case 'table': {
                return (
                  <SimpleFixItem
                    key={`${r.result.type}_${r.result.resultId}`}
                    loading={loadElement.includes(r.result.resultId)}
                    result={r.result}
                    onFix={() => {
                      handleFix(r, index);
                    }}
                    onRemove={() => {
                      handleRemoveImprovement(r.slideId, r.slideNumber, r.result.resultId);
                    }}
                  />
                );
              }
            }
          })}
        </div>
        {isParsed && !activeSlideImprovements.every(improvent => improvent.result.type === 'image') && (
          <div className="sticky bottom-0 flex h-16 w-full items-center justify-center border-t border-lightGreyPress bg-white p-4">
            <BaseButton
              onClick={async () => {
                await handleFixAllSlide(activeSlideImprovements);
                showSideBar();
              }}
              variant="outline"
              classNames="w-full"
            >
              {t('improveAllText')}
            </BaseButton>
          </div>
        )}
      </div>
    );
  }
  return <p className="mb-2 text-[14px] text-tertiaryText">{t('noImprovesText')}</p>;
};

export default SlideAnalytics;

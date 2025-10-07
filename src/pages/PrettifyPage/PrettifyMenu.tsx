import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Switch } from '@/components/ui/switch';
import useMobile from '@/hooks/useMobile';
import { cn } from '@/lib/utils';
import DrawerHeader from '@/components/DrawersAndSheets/DrawerHeader/DrawerHeader';
import MainContainer from '@/components/Containers/MainContainer';
import { PrettifyContext } from '@/contexts/Prettify.context';
import AiStars from '@/assets/ai-stars-1.svg?react';
import SmartSlides from '@/assets/smart-slides.png';
import ImageEnhancer from '@/assets/image-enhancer.png';
import SmartSlide1 from '@/assets/smart-slide-1.png';
import SmartSlide2 from '@/assets/smart-slide-2.png';
import SmartSlide3 from '@/assets/smart-slide-3.png';
import SmartBlur from '@/assets/smart-image-blur.png';
import SmartBlur2 from '@/assets/smart-image-blur2.png';

const PrettifyMenu = () => {
  const isMobile = useMobile();
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });
  const {
    aiText,
    setAiText,
    aiImages,
    setAiImages,
    adjustSlidesNumber,
    setAdjustSlidesNumber,
    setStep,
    handleGenerate,
  } = useContext(PrettifyContext);

  const goNext = () => {
    setStep('theme');
    handleGenerate();
  };

  return (
    <MainContainer>
      <div className={cn('w-full h-full ', { 'overflow-y-auto': isMobile })}>
        <DrawerHeader title={t('perfectSlide')} nextBtnText={t('continue')} onNextClick={goNext} />
        <div
          className={cn('flex w-full pt-4 md:pt-6 justify-center items-center gap-8', {
            'flex-col gap-4': isMobile,
            'h-[90%]': !isMobile,
          })}
        >
          <div
            className={cn('bg-lightGrey rounded-xl', {
              'flex-1 h-1/2': !isMobile,
              'w-full': isMobile,
            })}
          >
            <div
              className={cn(
                'flex flex-col relative justify-end px-10 rounded-t-xl overflow-hidden',
                {
                  'h-[220px]': !isMobile,
                  'h-[25vh]': isMobile,
                },
              )}
            >
              <div className="absolute inset-0 bg-lightGreyHover" />
              <div
                className={cn(
                  'absolute inset-0 bg-default-gradient transition-opacity duration-500 ease-in-out',
                  {
                    'opacity-100': aiImages,
                    'opacity-0': !aiImages,
                  },
                )}
              />

              <div className="relative w-full flex justify-center">
                <div className="relative inline-block">
                  <img src={ImageEnhancer} className="w-full object-contain" />
                  <img
                    src={aiImages ? SmartBlur2 : SmartBlur}
                    className="absolute left-0 top-0 h-full object-contain z-10"
                  />
                  <div
                    className={cn(
                      'absolute top-1 h-[97.5%] flex justify-center z-20',
                      aiImages ? 'left-[22.5%]' : 'left-[51.5%]',
                    )}
                  >
                    <div className="relative flex flex-col justify-center items-center h-full">
                      <div className="w-[2px] bg-white/80 h-full rounded" />
                      <div className="absolute top-1/2 -translate-y-1/2 bg-white rounded-full flex items-center justify-center size-6 border border-white">
                        <AiStars className="size-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 px-4 pt-6 pb-8 bg-lightGrey rounded-b-xl">
              <div className="flex justify-between">
                <div className="flex">
                  <AiStars />
                  <h1 className="text-darkHeadline text-xl font-bold">{t('imageEnhancer')}</h1>
                </div>
                <Switch
                  id="pages"
                  checked={aiImages}
                  onCheckedChange={() => {
                    setAiImages(!aiImages);
                  }}
                />
              </div>
              <p className="text-sm">{t('imageEnhanceDescription')}</p>
            </div>
          </div>
          <div
            className={cn('bg-lightGrey rounded-xl', {
              'flex-1 h-1/2': !isMobile,
              'w-full': isMobile,
            })}
          >
            <div
              className={cn(
                'flex flex-col relative justify-end items-center overflow-hidden px-10 rounded-t-xl',
                {
                  'h-[220px]': !isMobile,
                  'h-[25vh]': isMobile,
                },
              )}
            >
              <div className="absolute inset-0 bg-lightGreyHover" />
              <div
                className={cn(
                  'absolute inset-0 bg-default-gradient transition-opacity duration-500 ease-in-out',
                  {
                    'opacity-100': aiText,
                    'opacity-0': !aiText,
                  },
                )}
              />
              <div className="bg-white drop-shadow rounded-t-sm relative max-w-[217px] z-10">
                <div className="absolute -top-3 -right-3 size-8 rounded-full bg-white drop-shadow flex items-center justify-center">
                  <AiStars className="size-4" />
                </div>
                <div className="flex flex-col gap-2 px-4 py-6">
                  <p className="text-darkHeadline font-bold text-base">{t('ideaImpact')}</p>
                  <div className="mb-1">
                    <p
                      className={`text-sm transition-colors duration-200 ${aiText ? 'text-tertiaryText' : 'text-darkText'}`}
                    >
                      {t('ideaImpactDescription1')}
                    </p>
                    <p
                      className={`text-sm transition-colors duration-200 ${aiText ? 'text-tertiaryText' : 'text-disabled'}`}
                    >
                      {t('ideaImpactDescription2')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 px-4 pt-6 pb-8 bg-lightGrey rounded-b-xl">
              <div className="flex justify-between">
                <div className="flex">
                  <AiStars />
                  <h1 className="text-darkHeadline text-xl font-bold">{t('improveWording')}</h1>
                </div>
                <Switch
                  id="pages"
                  checked={aiText}
                  onCheckedChange={() => {
                    setAiText(!aiText);
                  }}
                />
              </div>
              <p className="text-sm">{t('improveWordingDescription')}</p>
            </div>
          </div>
          <div
            className={cn('bg-lightGrey rounded-xl', {
              'flex-1 h-1/2 w-full': !isMobile,
              'w-full': isMobile,
            })}
          >
            <div
              className={cn(
                'flex flex-col relative justify-end items-center overflow-hidden rounded-t-xl',
                {
                  'h-[220px]': !isMobile,
                  'h-[25vh]': isMobile,
                },
              )}
            >
              <div className="absolute inset-0 bg-lightGreyHover" />
              <div
                className={cn(
                  'absolute inset-0 bg-default-gradient transition-opacity duration-500 ease-in-out',
                  {
                    'opacity-100': adjustSlidesNumber,
                    'opacity-0': !adjustSlidesNumber,
                  },
                )}
              />
              <div className="relative">
                {!adjustSlidesNumber ? (
                  <div className="w-full h-full">
                    <img src={SmartSlides} className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="flex flex-col justify-end items-center gap-4">
                    <img src={SmartSlide1} />
                    <img src={SmartSlide2} />
                    <img src={SmartSlide3} />
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3 px-4 pt-6 pb-8 bg-lightGrey rounded-b-xl">
              <div className="flex justify-between">
                <div className="flex">
                  <AiStars />
                  <h1 className="text-darkHeadline text-xl font-bold">{t('smartSlides')}</h1>
                </div>
                <Switch
                  id="pages"
                  checked={adjustSlidesNumber}
                  onCheckedChange={() => {
                    setAdjustSlidesNumber(!adjustSlidesNumber);
                  }}
                />
              </div>
              <p className="text-sm">{t('smartSlidesDescription')}</p>
            </div>
          </div>
        </div>
        {isMobile && (
          <div className="mt-4 px-4 pb-4">
            <BaseButton onClick={goNext} classNames="h-12 w-full font-normal">
              {t('startWith')}
            </BaseButton>
          </div>
        )}
      </div>
    </MainContainer>
  );
};

export default PrettifyMenu;

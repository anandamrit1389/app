import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Keyboard, Pagination } from 'swiper/modules';
import { useEffect, useState } from 'react';
import TemplateSlideCards from './TemplateSlideCards';
import { Button } from '@/components/ui/button';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import PrevArrow from '@/assets/prew-arrow.svg?react';
import NextArrow from '@/assets/next-arrow.svg?react';
import { X } from 'lucide-react';
import PresentationService from '@/api/presentationService';
import useLocaleNavigate from '@/hooks/useLocaleNavigate';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import type { Swiper as SwiperType } from 'swiper';
import LanguageSelector from '@/components/DrawersAndSheets/PresentationOutlineDrawer/LanguageSelector/LanguageSelector';
import { ITemplate } from '@/interfaces/ISlides';
import { analyticsService } from '@/helpers/services/AnalyticsService';
import { getTemplate } from '@/helpers/constants/presentation-templates.const';
import { TemplateContext } from '@/contexts/Template.context';

interface IProps {
  show: boolean;
  onOpenChange: () => void;
  mobile?: boolean;
  templateKey?: string;
  templates: ITemplate[];
}

const TemplateViewer = ({ show, onOpenChange, mobile, templateKey, templates }: IProps) => {
  const navigate = useLocaleNavigate();
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const template = templates[activeSlideIndex];
  const templateInfo = getTemplate(template.template);

  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [initSlideIndex, setInitSlideIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState(template.language ?? 'english');

  const { t } = useTranslation('translation', { keyPrefix: 'templates' });

  useEffect(() => {
    const index = templates.findIndex((t) => t.template === templateKey);
    setActiveSlideIndex(index);
    setInitSlideIndex(index);
  }, [templateKey, templates]);

  const startWithTemplate = async () => {
    setLoading(true);

    if (template) {
      const presentation = await PresentationService.generatePresentationFromTemplate(
        template.template,
        language,
      );

      if (presentation) {
        analyticsService.trackPresentationCreation(presentation.id);
        navigate(`/presentation?presentationId=${presentation.id}&lang=${language}`);
      }
    }

    setLoading(false);
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
  };

  return (
    <TemplateContext.Provider value={{ templateTemplateInfo: templateInfo }}>
      <Sheet open={show} onOpenChange={onOpenChange}>
        <SheetContent
          outsideclose="true"
          side="bottom"
          className={cn('p-0 pb-8 flex flex-col items-center gap-0', {
            'h-[95%] rounded-t-xl px-0': !mobile,
            'h-full px-5': mobile,
          })}
        >
          <div className="mb-5 flex w-full justify-end md:hidden">
            <BaseButton
              onClick={onOpenChange}
              classNames="rounded-full p-1 bg-lightGrey"
              variant="ghost"
            >
              <X className="size-3" />
            </BaseButton>
          </div>
          <header className="w-full">
            <div className="mx-auto mt-8 flex w-full max-w-screen-lg items-center justify-between py-4">
              <SheetTitle
                className={cn('w-full text-start text-[20px] line-clamp-2', {
                  'text-center': mobile,
                })}
              >
                <p>{templateInfo?.title}</p>
              </SheetTitle>
              <div
                className={cn({
                  'flex gap-2': !mobile,
                  'fixed bottom-0 left-1/2 -translate-x-1/2 z-[100] bg-white w-full p-4': mobile,
                })}
              >
                <LanguageSelector
                  mobile={mobile}
                  lang={language}
                  onChange={handleLanguageChange}
                  triggerClassName="w-max bg-transparent border border-neutral-300"
                />
                <BaseButton
                  onClick={startWithTemplate}
                  loading={loading}
                  classNames={cn('h-10 px-3 py-2 w-[155px]', {
                    'w-full': mobile,
                  })}
                >
                  {t('startWithTemplate')}
                </BaseButton>
              </div>
            </div>
          </header>
          <div
            className={cn('flex items-center h-full max-w-[1174px] overflow-auto gap-8', {
              'mb-10': mobile,
            })}
          >
            {!mobile && (
              <Button
                className="rounded-full"
                variant="outline"
                onClick={() => {
                  if (activeSlideIndex > 0) {
                    swiper?.slidePrev();
                    setActiveSlideIndex((i) => i - 1);
                  }
                }}
                disabled={!activeSlideIndex}
              >
                <PrevArrow />
              </Button>
            )}
            <Swiper
              style={{ height: '100%' }}
              onSwiper={setSwiper}
              onSlideChange={(val) => {
                setActiveSlideIndex(val.activeIndex);
              }}
              cssMode={true}
              keyboard={true}
              slidesPerView={1}
              direction={'horizontal'}
              modules={[Keyboard, Pagination]}
            >
              {templates?.map((pres) => (
                <SwiperSlide key={pres.id}>
                  <TemplateSlideCards presentation={pres} index={initSlideIndex} mobile={mobile} />
                </SwiperSlide>
              ))}
            </Swiper>
            {!mobile && (
              <Button
                className="rounded-full"
                variant="outline"
                onClick={() => {
                  if (activeSlideIndex < templates.length - 1) {
                    swiper?.slideNext();
                    setActiveSlideIndex((i) => i + 1);
                  }
                }}
                disabled={activeSlideIndex === templates.length - 1}
              >
                <NextArrow />
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </TemplateContext.Provider>
  );
};

export default TemplateViewer;

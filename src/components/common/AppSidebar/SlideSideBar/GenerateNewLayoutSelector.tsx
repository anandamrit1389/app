import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { PresentationContext } from '@/contexts/Presentation.context';
import useMobile from '@/hooks/useMobile';

import parse from 'html-react-parser';
import { Fragment, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { changableSlideVariations } from '@/helpers/constants/slide-variations.const';
import { SlideTypes } from '@/interfaces/ISlides';
import SlideService from '@/api/slideService';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { getPreview } from '@/helpers/utils/preview';
import ConfirmationModal from '@/components/Modals/ConfirmationModal/ConfirmationModal';
import { CreditAction } from '@/interfaces/IPricing';

const hiddenSlideTypes: string[] = ['title-slide', 'closing-slide'];

const GenerateNewLayoutSelector = () => {
  const isMobile = useMobile();
  const {
    presentation,
    activeSlide,
    slideAlternatives,
    updateSlide,
    setSlideLoading,
    showSideBar,
  } = useContext(PresentationContext);
  const [isActive, setIsActive] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(activeSlide);
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    type: SlideTypes | null;
  }>({
    isOpen: false,
    type: null,
  });

  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });

  useEffect(() => {
    setCurrentSlide(activeSlide);
  }, [activeSlide]);

  const openConfirmDialog = (type: SlideTypes) => {
    setConfirmState({ isOpen: true, type });
  };

  const closeConfirmDialog = () => {
    setConfirmState({ isOpen: false, type: null });
  };

  const handleChangeSlideType = async (type: SlideTypes | null, aiSlide: boolean) => {
    if (!activeSlide || type === null) return;

    try {
      setSlideLoading(activeSlide?.id);
      setIsActive(false);
      setCurrentSlide({
        ...activeSlide,
        generationFinished: false,
        slideType: type,
      });

      const response = await SlideService.updateSlide(
        activeSlide?.id,
        {
          slideType: type,
          presentationId: presentation?.id,
        },
        aiSlide,
      );

      const updatedSlide = response.data;

      const existingSlide = presentation?.slides.find((slide) => slide.id === updatedSlide.id);
      if (existingSlide) {
        updatedSlide.slideNumber = existingSlide.slideNumber;
      }

      updateSlide(updatedSlide);
      setCurrentSlide(updatedSlide);

      if (isMobile) {
        showSideBar();
      }
    } catch (error) {
      console.error(error);
      updateSlide(activeSlide);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSlideLoading('');
      setIsActive(true);
    }
  };

  if (!currentSlide) {
    return;
  }

  if (
    hiddenSlideTypes.includes(currentSlide.slideType) ||
    (currentSlide.title === 'Agenda' && currentSlide.slideType === 'content-slide')
  ) {
    return null;
  }

  if (isMobile) {
    return (
      <>
        {slideAlternatives && slideAlternatives.length > 0 && (
          <AccordionItem value="generateNewLayoutSelector" className="![&_div]:overflow-auto">
            <AccordionTrigger>
              <span className="text-[12px] font-semibold uppercase">{t('generateNewLayout')}</span>
            </AccordionTrigger>
            <AccordionContent>
              <p className="mb-2 text-sm text-darkText">{t('generateNewLayoutText')}</p>
              <Select
                onValueChange={(type) => {
                  openConfirmDialog(type as SlideTypes);
                }}
                disabled={!isActive}
              >
                <SelectTrigger>
                  <div className="capitalize">
                    {changableSlideVariations[currentSlide.slideType]?.[0]?.mobile || 'default'}
                  </div>
                </SelectTrigger>
                <SelectContent className="p-0 [&>div]:p-0">
                  <SelectGroup className="p-2">
                    {Object.entries(changableSlideVariations).map(([slideType, slide]) => (
                      <SelectItem
                        key={slideType}
                        value={slideType}
                        className="p-2 text-sm text-darkText hover:bg-lightGrey data-[disabled]:bg-lightGrey data-[disabled]:opacity-100 [&_svg]:size-6 [&_svg]:stroke-slushPink"
                      >
                        {slide[0].mobile}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <ConfirmationModal
                open={confirmState.isOpen}
                onOpenChange={closeConfirmDialog}
                onAction={(isAiSlide: boolean) => {
                  handleChangeSlideType(confirmState.type, isAiSlide);
                  showSideBar();
                }}
                creditAction={CreditAction.CHANGE_CARD_LAYOUT}
              />
            </AccordionContent>
          </AccordionItem>
        )}
      </>
    );
  }

  return (
    <>
      <AccordionItem
        value="generateNewLayoutSelector"
        className="![&_div]:overflow-auto border-none"
      >
        <AccordionTrigger>
          <span className="text-[12px] font-medium uppercase">{t('generateNewLayout')}</span>
        </AccordionTrigger>
        <AccordionContent>
          <p className="mb-2 text-sm text-darkText">{t('generateNewLayoutText')}</p>
          <div className="grid grid-cols-2 gap-4 p-1.5">
            {Object.entries(changableSlideVariations).map(([slideType, slide]) => {
              return (
                <Fragment key={slideType}>
                  {slide[0]?.preview ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            onClick={() => openConfirmDialog(slideType as SlideTypes)}
                            disabled={!isActive}
                            className={
                              slideType === currentSlide?.slideType
                                ? 'relative size-full rounded p-0 outline outline-2 outline-offset-4 outline-pink'
                                : 'relative size-full rounded p-0 outline-2 outline-offset-4 outline-grey hover:outline'
                            }
                          >
                            {parse(getPreview(slide[0].preview))}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{slide[0].mobile}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : null}
                </Fragment>
              );
            })}
          </div>
          <ConfirmationModal
            open={confirmState.isOpen}
            onOpenChange={closeConfirmDialog}
            onAction={(isAiSlide: boolean) => {
              handleChangeSlideType(confirmState.type, isAiSlide);
            }}
            creditAction={CreditAction.CHANGE_CARD_LAYOUT}
          />
        </AccordionContent>
      </AccordionItem>
    </>
  );
};

export default GenerateNewLayoutSelector;

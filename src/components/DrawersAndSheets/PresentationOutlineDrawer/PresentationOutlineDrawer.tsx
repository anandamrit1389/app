import { useCallback, useContext } from 'react';
import { PromptPageContext } from '@/contexts/PromptPage.context';
import OutlineSlideItem from './OutlineSlideItem/OutlineSlideItem';
import { ISlide } from '@/interfaces/ISlides';
import ArrowBack from '@/assets/arrow-back.svg?react';
import { useTranslation } from 'react-i18next';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import AIStars from '@/assets/ai-stars.svg?react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import MainContainer from '@/components/Containers/MainContainer';
import DrawerHeader from '../DrawerHeader/DrawerHeader';

const PresentationOutlineDrawer = ({ mobile }: { mobile?: boolean }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });

  const {
    setPresentationOutline,
    setShowOutlineDrawer,
    showOutlineDrawer,
    presentationOutline,
    updateSlidesOrder,
    setStep,
    setShowMiddleware,
    handleToggleStyleImageDrawer,
  } = useContext(PromptPageContext);

  const handleNewAfter = (index: number) => {
    const newSlide: ISlide = {
      id: crypto.randomUUID(),
      slideNumber: index + 1,
      slideType: 'image-text-slide',
      variation: 'left',
      title: '',
      titleTranslations: {},
      subtitleTranslations: {},
      content: [],
    };

    let allSlides = presentationOutline;
    allSlides.splice(index + 1, 0, newSlide);
    allSlides = allSlides.map((slide, i) => ({
      ...slide,
      slideNumber: i + 1,
    }));

    setPresentationOutline(allSlides);
  };

  const handleChangeText = (val: string, index: number) => {
    const outline = presentationOutline.map((o, i) => {
      return index === i ? { ...o, description: val } : o;
    });

    setPresentationOutline(outline);
  };

  const handleUpdateLayout = (val: ISlide, index: number) => {
    const outline = presentationOutline.map((o, i) => {
      return index === i ? val : o;
    });

    setPresentationOutline(outline);
  };

  const handleDelete = (index: number) => {
    const outline = presentationOutline.filter((_, i) => i !== index);

    setPresentationOutline(outline);
  };

  const handleReroll = (index: number, val: ISlide) => {
    const outline = presentationOutline.map((o, i) => {
      return index === i ? val : o;
    });

    setPresentationOutline(outline);
  };

  const goNext = () => {
    setShowOutlineDrawer(!showOutlineDrawer);
    handleToggleStyleImageDrawer();
  };

  const goBack = () => {
    setStep('theme');
    setShowMiddleware(true);
    setShowOutlineDrawer(false);
  };

  const moveSlide = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      if (presentationOutline) {
        const newSlides = [...presentationOutline];
        const [removed] = newSlides.splice(dragIndex, 1);
        newSlides.splice(hoverIndex, 0, removed);

        // Update slideNumber for each slide
        const updatedSlides = newSlides.map((slide, index) => ({
          ...slide,
          slideNumber: index + 1,
        }));

        updateSlidesOrder(updatedSlides);
      }
    },
    [presentationOutline],
  );

  if (mobile) {
    return (
      <>
        <Sheet
          open={showOutlineDrawer}
          onOpenChange={() => setShowOutlineDrawer(!showOutlineDrawer)}
        >
          <SheetContent
            outsideclose="true"
            side="bottom"
            className="flex h-dvh justify-center p-0 pb-10 pe-2 ps-4 pt-4"
          >
            <div className="realtive w-full">
              <div className="absolute flex items-center justify-between">
                <div className="flex w-full items-center justify-between gap-4">
                  <BaseButton
                    classNames="p-0"
                    variant="ghost"
                    onClick={() => setShowOutlineDrawer(!showOutlineDrawer)}
                  >
                    <ArrowBack />
                  </BaseButton>
                </div>
              </div>
              <SheetHeader>
                <SheetTitle className="text-center text-base">
                  {t('presentationOutline')}
                </SheetTitle>
                <p className="mt-0">{t('slides', { count: presentationOutline?.length })}</p>
              </SheetHeader>
              <DndProvider backend={HTML5Backend}>
                <div className="mt-10 flex h-full flex-wrap justify-center gap-4 overflow-auto pb-56">
                  {presentationOutline?.map((o, index) => {
                    return (
                      <OutlineSlideItem
                        moveSlide={moveSlide}
                        index={index + 1}
                        mobile
                        key={o.title}
                        outline={o}
                        onChangeText={(val) => handleChangeText(val, index)}
                        onUpdateLayout={(val) => handleUpdateLayout(val, index)}
                        onDelete={() => handleDelete(index)}
                        onAddNew={() => handleNewAfter(index)}
                        onReroll={(val) => handleReroll(index, val)}
                      />
                    );
                  })}
                </div>
              </DndProvider>
            </div>
            <div className="fixed bottom-0 z-[60] flex w-full gap-4 bg-white p-4 shadow-2xl">
              <BaseButton
                variant="outline"
                classNames="h-12 rounded-xl"
                onClick={() => setShowOutlineDrawer(!showOutlineDrawer)}
              >
                {t('cancel')}
              </BaseButton>
              <BaseButton classNames="text-white h-12 rounded-xl w-full" onClick={goNext}>
                <AIStars />
                {t('startWith')}
              </BaseButton>
            </div>
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <Sheet open={showOutlineDrawer} onOpenChange={() => setShowOutlineDrawer(!showOutlineDrawer)}>
      <SheetContent
        outsideclose="true"
        side="bottom"
        className="flex h-[95%] justify-center rounded-t-xl"
      >
        <MainContainer>
          <div className="flex w-full flex-col items-center">
            <SheetHeader className="flex w-full flex-row items-center justify-between">
              <SheetTitle className="flex w-full items-center gap-2 text-center text-[24px]">
                <DrawerHeader
                  title={t('presentationOutline')}
                  nextBtnText={t('startWith')}
                  onPrevClick={goBack}
                  onNextClick={goNext}
                  isDisabledNextButton={!!presentationOutline?.find((o) => !o.description)}
                />
              </SheetTitle>
            </SheetHeader>

            <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-4 tablet:grid-cols-3 medium-desktop:grid-cols-4">
              <DndProvider backend={HTML5Backend}>
                {presentationOutline?.map((o, index) => {
                  return (
                    <OutlineSlideItem
                      key={o.title}
                      outline={o}
                      onChangeText={(val) => handleChangeText(val, index)}
                      onUpdateLayout={(val) => handleUpdateLayout(val, index)}
                      onDelete={() => handleDelete(index)}
                      onReroll={(val) => handleReroll(index, val)}
                      moveSlide={moveSlide}
                      onAddNew={() => handleNewAfter(index)}
                      index={index + 1}
                    />
                  );
                })}
              </DndProvider>
            </div>
          </div>
        </MainContainer>
      </SheetContent>
    </Sheet>
  );
};

export default PresentationOutlineDrawer;

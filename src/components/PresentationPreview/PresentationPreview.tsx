import { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { PresentationContext } from '../../contexts/Presentation.context';
import DraggableSlide from './DraggableSlide';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ISlide } from '@/interfaces/ISlides';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import PresentationPreviewActions from './PresentationPreviewActions';
import AddNewSlideDialog from '../Dialogs/AddNewSlideDialog/AddNewSlideDialog';
interface IProps {
  mobile?: boolean;
  onOpenChange?: () => void;
  openPreview?: boolean;
}

const PresentationPreview = ({ mobile, openPreview, onOpenChange }: IProps) => {
  const {
    presentation,
    updateSlidesOrder,
    changeActiveSlide,
    readonly,
    showAgenda,
    showEndScreen,
    filterSlides,
  } = useContext(PresentationContext);

  const [open, setOpen] = useState<boolean>(false);
  const [addAfterSlide, setAddAfterSlide] = useState<boolean>(false);

  const moveSlide = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      if (!presentation) return;

      const newSlides = filterSlides([...presentation.slides]);
      const [removed] = newSlides.splice(dragIndex, 1);
      newSlides.splice(hoverIndex, 0, removed);

      const contentSlide = presentation.slides.find((s) => s.slideType === 'content-slide');

      const closingSlide = presentation.slides.find((s) => s.slideType === 'closing-slide');

      // Update slideNumber for each slide
      let updatedSlides = newSlides.map((slide, index) => ({
        ...slide,
        slideNumber: index + 1,
      }));

      if (contentSlide && !showAgenda) {
        updatedSlides = newSlides.map((slide, index) => {
          if (index === 0) {
            slide.slideNumber = 1;
          } else {
            slide.slideNumber = index + 2;
          }
          return slide;
        });

        updatedSlides.splice(1, 0, contentSlide);
      }

      if (closingSlide && !showEndScreen) {
        updatedSlides.push({
          ...closingSlide,
          slideNumber: updatedSlides.length + 1,
        });
      }

      updateSlidesOrder(updatedSlides);
    },
    [presentation, filterSlides, showAgenda, showEndScreen, updateSlidesOrder],
  );

  const handleClick = (slide: ISlide) => {
    changeActiveSlide(slide.id);
    onOpenChange?.();
  };

  const slideIndex = useRef<number | null>(null);

  const slides = useMemo(() => {
    return filterSlides(presentation?.slides);
  }, [presentation?.slides, filterSlides]);

  if (mobile) {
    return (
      <Sheet open={openPreview} onOpenChange={() => onOpenChange?.()} modal={false}>
        <SheetContent
          outsideclose="true"
          side="left"
          className="z-10 grid h-dvh w-full grid-cols-2 gap-x-4 overflow-auto px-5 pt-20"
        >
          <SheetTitle className="hidden">Presentation previews</SheetTitle>
          <DndProvider backend={HTML5Backend}>
            {slides?.map((slide, index) => {
              return readonly ? (
                <div key={`preview-${slide.id}`} onClick={() => handleClick(slide)}>
                  <PresentationPreviewActions slide={slide} onAddSlide={() => {}} index={index} />
                </div>
              ) : (
                <DraggableSlide
                  key={`preview-${slide.id}`}
                  index={index}
                  slide={slide}
                  moveSlide={moveSlide}
                  onClick={handleClick}
                  mobile
                />
              );
            })}
          </DndProvider>
        </SheetContent>
      </Sheet>
    );
  }

  if (readonly) {
    return (
      <div className="flex size-full flex-col items-center gap-3 overflow-y-auto overflow-x-hidden py-5">
        {slides?.map((slide, index) => {
          return <PresentationPreviewActions index={index} slide={slide} onAddSlide={() => {}} />;
        })}
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex size-full flex-col items-center justify-between bg-[#F8FAFC]">
        <div className="flex size-full flex-col items-center gap-3 overflow-y-auto overflow-x-hidden py-5">
          {slides?.map((slide, index) => {
            return (
              <DraggableSlide
                key={`preview-${slide.id}`}
                index={index}
                slide={slide}
                moveSlide={moveSlide}
                onAddSlide={() => {
                  slideIndex.current = slide.slideNumber;
                  setAddAfterSlide(true);
                  setOpen(!open);
                }}
              />
            );
          })}
        </div>
        {!readonly && (
          <div className="flex flex-col gap-1 p-4">
            <AddNewSlideDialog
              isOpen={true}
              open={open}
              onChangeOpen={setOpen}
              index={slideIndex.current}
              addAfterSlide={addAfterSlide}
              setAddAfterSlide={setAddAfterSlide}
            />
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default PresentationPreview;

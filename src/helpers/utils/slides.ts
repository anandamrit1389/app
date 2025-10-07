import { ISlide } from '@/interfaces/ISlides';
import ArrowBig from '@/components/Icons/ArrowBig';

export const reorderSlides = (slides: ISlide[], index?: number) => {
  let updatedSlides = [...slides];

  const closingSlideIndex = updatedSlides.findIndex((slide) => slide.slideType === 'closing-slide');
  let closingSlide: ISlide | undefined;

  if (closingSlideIndex !== -1) {
    [closingSlide] = updatedSlides.splice(closingSlideIndex, 1);
  }

  if (index !== undefined && index >= 0) {
    const [removed] = updatedSlides.splice(updatedSlides.length - 1, 1);
    updatedSlides.splice(index, 0, removed);
  }

  if (closingSlide) {
    updatedSlides.push(closingSlide);
  }

  updatedSlides = updatedSlides.map((slide, i) => ({
    ...slide,
    slideNumber: i + 1,
  }));

  return updatedSlides;
};

export const arrowShapeMap: Record<
  string,
  {
    component: React.FC<React.SVGProps<SVGSVGElement>>;
    defaultWidth: string;
  }
> = {
  arrowBig: { component: ArrowBig, defaultWidth: "3%" },
};

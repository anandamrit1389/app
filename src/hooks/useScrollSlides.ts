import { IPresentation, ISlide } from '@/interfaces/ISlides';
import { useRef } from 'react';

const useScrollSlides = (
  presentation: IPresentation | null,
  changeActiveSlide: (val: string) => void,
  setActiveImage: (val: null) => void,
  currentSideBarType: string,
  showSideBar: () => void,
  isSideBarActive: boolean,
  filterSlides: (val: ISlide[] | undefined) => ISlide[],
  activeSlide?: ISlide,
) => {
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    if (isScrolling.current && scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);

      scrollTimeout.current = setTimeout(() => {
        isScrolling.current = false;
      }, 250);
      return;
    }

    isScrolling.current = true;

    if (activeSlide) {
      const slides = filterSlides(presentation?.slides);
      const activeIndex = slides?.findIndex((s) => s.id === activeSlide?.id) ?? 0;
      const newId =
        e.deltaY > 0
          ? slides?.[Math.min(activeIndex + 1, slides.length - 1)]?.id
          : slides?.[Math.max(activeIndex - 1, 0)]?.id;

      if (newId) {
        changeActiveSlide(newId);
        setActiveImage(null);

        if (isSideBarActive && currentSideBarType === 'webimages') {
          showSideBar();
        }
      }
    }

    scrollTimeout.current = setTimeout(() => {
      isScrolling.current = false;
    }, 500);
  };

  return handleScroll;
};

export default useScrollSlides;

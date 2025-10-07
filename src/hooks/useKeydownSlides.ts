import { useEffect, useCallback } from 'react';
import { IPresentation, ISlide } from '@/interfaces/ISlides';

const useKeydownSlides = (
  presentation: IPresentation | null,
  changeActiveSlide: (val: string) => void,
  setActiveImage: (val: null) => void,
  currentSideBarType: string,
  showSideBar: () => void,
  isSideBarActive: boolean,
  filterSlides: (val: ISlide[] | undefined) => ISlide[],
  activeSlide?: ISlide,
) => {
  const handleKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (!presentation?.generationFinished) return;

      const target = e.target as HTMLElement;
      const isFormElement =
        target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT';

      if (isFormElement) return;

      if (!activeSlide) return;

      const slides = filterSlides(presentation?.slides);
      const activeIndex = slides?.findIndex((s) => s.id === activeSlide?.id) ?? 0;

      let newId: string | undefined;

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        newId = slides?.[Math.min(activeIndex + 1, slides.length - 1)]?.id;
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        newId = slides?.[Math.max(activeIndex - 1, 0)]?.id;
      }

      if (newId) {
        changeActiveSlide(newId);
        setActiveImage(null);

        if (isSideBarActive && currentSideBarType === 'webimages') {
          showSideBar();
        }
      }
    },
    [activeSlide, presentation, isSideBarActive, currentSideBarType],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [handleKeydown]);

  return null;
};

export default useKeydownSlides;

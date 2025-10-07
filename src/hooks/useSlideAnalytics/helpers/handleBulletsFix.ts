import { IPresentation, ISlide } from '@/interfaces/ISlides';
import { IBrokenSlide, IBulletSlideResult } from '../interfaces';

export const handleBulletsFix = (
  toFix: IBrokenSlide,
  presentation: IPresentation,
  splitSlideByBullets: (slideId: string, maxPerSlide: number) => void,
  updateSlide: (slide: ISlide) => void,
): boolean => {
  const result = toFix.result as IBulletSlideResult;
  if (result.bulletSuggestion === 'splitSlide') {
    splitSlideByBullets(toFix.slideId, result.count || 5);
  } else if (result.bulletSuggestion === 'convertToText') {
    const updatedSlide = presentation?.slides.find((s) => s.id === toFix.slideId);
    if (!updatedSlide) {
      return false;
    }
    updatedSlide.slideType = 'image-text-slide';
    updatedSlide.variation = 'right';
    updatedSlide.content[0].contentType = 'text';
    updateSlide(updatedSlide);
  }
  return true;
};

import { IBrokenSlide } from '../interfaces';
import { checkTitleSlide } from './checkTitleSlide';
import { checkBulletPointSlide } from './checkBulletPointSlide';
import { checkImportantTextSlide } from './checkImportantTextSlide';
import { checkTextSlide } from './checkTextSlide';
import { checkImageCaptionSlide } from './checkImageCaptionSlide';
import { checkImageTextSlide } from './checkImageTextSlide';
import { checkImagesSlide } from './checkImagesSlide';
import { checkTableSlide } from './checkTableSlide';

export const slideChecks = {
  'title-slide': checkTitleSlide,
  'section-headline-slide': checkTitleSlide,
  'image-text-slide': checkImageTextSlide,
  'image-caption-slide': checkImageCaptionSlide,
  'text-slide': checkTextSlide,
  'bullet-points-slide': checkBulletPointSlide,
  // "shapes-slide": checkBulletPointSlide,
  'important-text-slide': checkImportantTextSlide,
  'images-slide': checkImagesSlide,
  'table-slide': checkTableSlide,
};

export const getButtonStatus = (
  improvements: IBrokenSlide[],
  isSlideConverted: boolean,
): {
  color: string;
  hint: string;
  status: 'statusGood' | 'statusImprove' | 'statusUnconverted';
} => {
  if (!isSlideConverted) {
    return {
      color: '#312929',
      hint: 'Your slide needs manual attention',
      status: 'statusUnconverted',
    };
  }

  if (improvements.length > 10) {
    return {
      color: '#F34749',
      hint: 'Your slide needs help',
      status: 'statusImprove',
    };
  }

  if (improvements.length > 0) {
    return {
      color: '#FFAB24',
      hint: 'Your slide needs attention',
      status: 'statusImprove',
    };
  }

  return {
    color: '#3BD73E',
    hint: 'Your slide is perfect',
    status: 'statusGood',
  };
};

import { ISlideVariation } from '@/interfaces/ISlideVariation';

export const variations: ISlideVariation[] = [
  {
    type: 'long-text',
    containerClassName: 'pt-contentTop',
    plainTextClassName:
      'text-normalText mb-content w-8/12 font-normal text-normalTextFontSize font-bodyFont',
    slideHeadingClassName: 'text-smallHeading font-bold text-headline font-titleFont',
    subtitleClassName: 'text-sectionHeading font-semibold mb-content w-10/12 font-titleFont',
    contentSubtitleClassName: 'hidden',
  },
  {
    type: 'side-text',
    containerClassName: 'flex pt-contentTop',
    plainTextClassName:
      'text-normalText mb-content w-10/12 font-normal text-normalTextFontSize font-bodyFont',
    slideHeadingClassName: 'text-smallHeading font-bold text-headline font-titleFont w-[90%]',
    subtitleClassName: 'hidden',
    contentSubtitleClassName:
      'font-semibold text-normalTextFontSize font-bodyFont text-smallSubHeadline',
    pageContainerClassName: 'w-1/2',
    textContainerClassName: 'w-1/2',
  },
  {
    type: 'two-col-text',
    containerClassName: 'pt-contentTop',
    plainTextClassName:
      'text-normalText mb-content font-normal text-normalTextFontSize h-full w-11/12 font-bodyFont',
    slideHeadingClassName: 'text-smallHeading font-bold text-headline font-titleFont',
    subtitleClassName: 'hidden',
    contentSubtitleClassName:
      'font-semibold text-normalTextFontSize font-bodyFont text-smallSubHeadline',
    textContainerClassName:
      'grid grid-flow-col w-full mt-presentation gap-presentation',
  },
  {
    type: 'short-text',
    containerClassName: 'pt-contentTop',
    plainTextClassName: 'text-normalText mb-content w-10/12 font-normal text-sectionHeading',
    slideHeadingClassName: 'text-smallHeading font-bold text-headline font-titleFont',
    subtitleClassName: 'hidden',
    contentSubtitleClassName: 'hidden',
  },
];

export const mobileVariations: ISlideVariation[] = [
  {
    type: 'long-text',
    containerClassName: 'pt-8 sm:pt-presentation',
    plainTextClassName:
      'text-base text-normalText mb-content w-11/12 font-normal sm:text-normalTextFontSize font-bodyFont',
    slideHeadingClassName:
      'text-[28px] sm:text-smallHeading font-bold text-headline leading-tight my-contentTop font-titleFont',
    subtitleClassName:
      'text-sm sm:text-sectionHeading font-semibold mb-content w-10/12 font-titleFont',
    contentSubtitleClassName: 'hidden',
  },
  {
    type: 'side-text',
    containerClassName: 'flex flex-col pt-8 sm:pt-presentation',
    plainTextClassName:
      'text-base text-normalText mb-content w-10/12 font-normal sm:text-normalTextFontSize font-bodyFont',
    slideHeadingClassName:
      'text-[28px] sm:text-smallHeading font-bold text-headline leading-tight mb-content font-titleFont',
    subtitleClassName: 'hidden',
    contentSubtitleClassName:
      'text-base font-semibold sm:text-normalTextFontSize leading-tight font-bodyFont',
    pageContainerClassName: 'mt-contentTop',
    textContainerClassName: 'w-full',
  },
  {
    type: 'two-col-text',
    containerClassName: 'pt-8 sm:pt-presentation',
    plainTextClassName:
      'text-base text-normalText mb-content font-normal sm:text-normalTextFontSize size-full font-bodyFont',
    slideHeadingClassName:
      'text-[28px] sm:text-smallHeading font-bold text-headline leading-tight mt-contentTop font-titleFont',
    subtitleClassName: 'hidden',
    contentSubtitleClassName: 'text-base font-semibold sm:text-normalTextFontSize font-bodyFont',
    textContainerClassName: 'w-full mt-presentation',
  },
  {
    type: 'short-text',
    containerClassName: 'pt-8 sm:pt-contentTop',
    plainTextClassName:
      'text-base text-normalText mb-content w-full font-semibold sm:text-headlineSize font-bodyFont',
    slideHeadingClassName:
      'text-[28px] sm:text-smallHeading font-bold text-headline leading-tight mb-contentTop font-titleFont',
    subtitleClassName: 'hidden',
    contentSubtitleClassName: 'hidden',
  },
];

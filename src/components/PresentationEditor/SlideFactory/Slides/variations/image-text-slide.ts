import { ISlideVariation } from '@/interfaces/ISlideVariation';

export const variations: ISlideVariation[] = [
  {
    type: 'left',
    containerClassName: 'flex size-full',
    imageContainerClassName: 'w-1/2',
    textContainerClassName: 'w-1/2 p-presentation mt-contentTop',
    imageClassName: 'object-cover size-full',
    plainTextClassName: 'text-normalText text-normalTextFontSize font-bodyFont',
    slideHeadingClassName: 'text-headline font-bold text-smallHeading mb-content font-titleFont',
  },
  {
    type: 'right',
    containerClassName: 'flex size-full flex-row-reverse',
    imageContainerClassName: 'w-1/2',
    textContainerClassName: 'w-1/2 p-presentation mt-contentTop',
    imageClassName: 'object-cover size-full',
    plainTextClassName: 'text-normalText text-normalTextFontSize font-bodyFont',
    slideHeadingClassName: 'text-headline font-bold text-smallHeading mb-content font-titleFont',
  },
  {
    type: 'left-1/3',
    containerClassName: 'flex size-full',
    imageContainerClassName: 'w-1/3',
    textContainerClassName: 'w-2/3 p-presentation mt-contentTop',
    imageClassName: 'object-cover size-full',
    plainTextClassName: 'text-normalText text-normalTextFontSize font-bodyFont',
    slideHeadingClassName: 'text-headline font-bold text-smallHeading mb-content font-titleFont',
  },
  {
    type: 'right-1/3',
    containerClassName: 'flex size-full flex-row-reverse',
    imageContainerClassName: 'w-1/3',
    textContainerClassName: 'w-2/3 p-presentation mt-contentTop',
    imageClassName: 'object-cover size-full',
    plainTextClassName: 'text-normalText text-normalTextFontSize mb-content font-bodyFont',
    slideHeadingClassName: 'text-headline font-bold text-smallHeading mb-content font-titleFont',
  },
  {
    type: 'left-1/3-bolder',
    containerClassName: 'flex size-full',
    imageContainerClassName: 'w-1/3',
    textContainerClassName: 'w-2/3 p-presentation mt-contentTop',
    imageClassName: 'object-cover size-full',
    plainTextClassName: 'text-normalText text-sectionHeading font-semibold font-bodyFont',
    slideHeadingClassName: 'text-headline font-bold text-smallHeading mb-content font-titleFont',
  },
  {
    type: 'right-1/3-bolder',
    containerClassName: 'flex size-full flex-row-reverse',
    imageContainerClassName: 'w-1/3',
    textContainerClassName: 'w-2/3 p-presentation mt-contentTop',
    imageClassName: 'object-cover size-full',
    plainTextClassName: 'text-normalText text-sectionHeading font-semibold font-bodyFont',
    slideHeadingClassName: 'text-headline font-bold text-smallHeading mb-content font-titleFont',
  },
  {
    type: 'left-1/3-withoutHeading',
    containerClassName: 'flex size-full',
    imageContainerClassName: 'w-1/3',
    textContainerClassName: 'w-2/3 p-presentation mt-contentTop',
    imageClassName: 'object-cover size-full',
    plainTextClassName: 'text-normalText text-sectionHeading font-semibold font-bodyFont',
    slideHeadingClassName: 'hidden',
  },
  {
    type: 'right-1/3-withoutHeading',
    containerClassName: 'flex size-full flex-row-reverse',
    imageContainerClassName: 'w-1/3',
    textContainerClassName: 'w-2/3 p-presentation mt-contentTop',
    imageClassName: 'object-cover size-full',
    plainTextClassName: 'text-normalText text-sectionHeading font-semibold font-bodyFont',
    slideHeadingClassName: 'hidden',
  },
  {
    type: 'top',
    containerClassName: 'flex size-full flex-col',
    imageContainerClassName: 'w-full h-2/3',
    textContainerClassName: 'w-full h-1/3 flex p-presentation justify-between',
    imageClassName: 'object-cover size-full',
    plainTextClassName: 'text-normalText text-normalTextFontSize w-11/12 font-bodyFont h-full',
    slideHeadingClassName:
      'text-headline font-bold text-smallHeading mb-content w-11/12 font-titleFont',
    verticalLayout: true,
  },
  {
    type: 'bottom',
    containerClassName: 'flex size-full flex-col-reverse',
    imageContainerClassName: 'w-full h-2/3',
    textContainerClassName: 'w-full h-1/3 flex px-presentation pt-contentTop justify-between',
    imageClassName: 'object-cover size-full',
    plainTextClassName: 'text-normalText text-normalTextFontSize w-11/12 font-bodyFont h-full',
    slideHeadingClassName:
      'text-headline font-bold text-smallHeading mb-content w-11/12 font-titleFont',
    verticalLayout: true,
  },
];

export const mobileVariations: ISlideVariation[] = [
  {
    type: 'left',
    containerClassName: 'flex flex-col size-full',
    imageContainerClassName: 'w-full h-1/3',
    textContainerClassName: 'overflow-auto w-full h-2/3 p-presentation mt-contentTop',
    imageClassName: 'object-cover size-full',
    plainTextClassName: 'text-normalText text-base sm:text-normalTextFontSize font-bodyFont',
    slideHeadingClassName:
      'text-headline font-bold text-[28px] sm:text-smallHeading mb-content font-titleFont',
  },
  {
    type: 'right',
    containerClassName: 'flex flex-col-reverse size-full',
    imageContainerClassName: 'w-full h-1/3',
    textContainerClassName: 'overflow-auto w-full h-2/3 p-presentation mt-contentTop',
    imageClassName: 'object-cover size-full',
    plainTextClassName: 'text-normalText text-base sm:text-normalTextFontSize font-bodyFont',
    slideHeadingClassName:
      'text-headline font-bold text-[28px] sm:text-smallHeading mb-content font-titleFont',
  },
  {
    type: 'left-1/3',
    containerClassName: 'flex flex-col size-full',
    imageContainerClassName: 'h-1/3',
    textContainerClassName: 'overflow-auto h-2/3 p-presentation mt-contentTop',
    imageClassName: 'object-cover size-full',
    plainTextClassName: 'text-normalText text-base sm:text-normalTextFontSize font-bodyFont',
    slideHeadingClassName:
      'text-headline font-bold text-[28px] sm:text-smallHeading mb-content font-titleFont',
  },
  {
    type: 'right-1/3',
    containerClassName: 'flex flex-col-reverse size-full pt-contentTop',
    imageContainerClassName: 'h-1/3',
    textContainerClassName: 'overflow-auto h-2/3 p-presentation mt-contentTop',
    imageClassName: 'object-cover size-full',
    plainTextClassName: 'text-normalText text-base sm:text-normalTextFontSize font-bodyFont',
    slideHeadingClassName:
      'text-headline font-bold text-[28px] sm:text-smallHeading mb-content font-titleFont',
  },
  {
    type: 'left-1/3-bolder',
    containerClassName: 'flex flex-col-reverse size-full',
    imageContainerClassName: 'h-1/3',
    textContainerClassName: 'h-2/3 p-presentation mt-contentTop',
    imageClassName: 'object-cover size-full',
    plainTextClassName:
      'text-normalText text-base sm:text-normalTextFontSize font-semibold font-bodyFont',
    slideHeadingClassName:
      'text-headline font-bold text-[28px] sm:text-smallHeading mb-content font-titleFont',
  },
  {
    type: 'right-1/3-bolder',
    containerClassName: 'flex size-full flex-col',
    imageContainerClassName: 'h-1/3',
    textContainerClassName: 'overflow-auto h-2/3 p-presentation mt-contentTop',
    imageClassName: 'object-cover size-full',
    plainTextClassName:
      'text-normalText text-base sm:text-normalTextFontSize font-semibold font-bodyFont',
    slideHeadingClassName:
      'text-headline font-bold text-[28px] sm:text-smallHeading mb-content font-titleFont',
  },
  {
    type: 'left-1/3-withoutHeading',
    containerClassName: 'flex flex-col size-full',
    imageContainerClassName: 'h-1/3',
    textContainerClassName: 'overflow-auto h-2/3 p-presentation mt-contentTop',
    imageClassName: 'object-cover size-full',
    plainTextClassName:
      'text-normalText text-base sm:text-smallHeadingFontSize font-semibold font-bodyFont',
    slideHeadingClassName: 'hidden',
  },
  {
    type: 'right-1/3-withoutHeading',
    containerClassName: 'flex flex-col-reverse size-full',
    imageContainerClassName: 'h-1/3',
    textContainerClassName: 'overflow-auto h-2/3 p-presentation mt-contentTop',
    imageClassName: 'object-cover size-full',
    plainTextClassName:
      'text-normalText text-base sm:text-smallHeadingFontSize font-semibold font-bodyFont',
    slideHeadingClassName: 'hidden',
  },
  {
    type: 'top',
    containerClassName: 'flex size-full flex-col pt-8',
    imageContainerClassName: 'w-full h-2/3',
    textContainerClassName: 'overflow-auto w-full h-1/3 flex flex-col p-presentation',
    imageClassName: 'object-cover size-full',
    plainTextClassName:
      'text-normalText text-base sm:text-normalTextFontSize size-full font-bodyFont',
    slideHeadingClassName:
      'text-headline font-bold text-[28px] sm:text-smallHeading mb-content w-full font-titleFont',
  },
  {
    type: 'bottom',
    containerClassName: 'flex size-full flex-col-reverse',
    imageContainerClassName: 'w-full h-2/3',
    textContainerClassName: 'overflow-auto w-full h-1/3 flex flex-col p-presentation mt-contentTop',
    imageClassName: 'object-cover size-full',
    plainTextClassName: 'text-normalText text-base sm:text-normalTextFontSize w-full font-bodyFont',
    slideHeadingClassName:
      'text-headline font-bold text-[28px] sm:text-smallHeading mb-content w-full font-titleFont',
  },
];

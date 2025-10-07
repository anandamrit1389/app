import { ISlideVariation } from '@/interfaces/ISlideVariation';

export const variations: ISlideVariation[] = [
  {
    type: 'central',
    containerClassName: 'size-full flex flex-col items-center justify-center',
    plainTextClassName:
      'text-heading leading-tight font-bold text-normalText text-center w-10/12 font-bodyFont',
    textContainerClassName: 'w-full flex justify-center font-titleFont',
    slideHeadingClassName:
      'text-subheadline font-semibold text-normalSubHeadline mb-presentation text-center w-8/12 font-titleFont',
  },
  {
    type: 'left',
    containerClassName: 'size-full items-center justify-center',
    plainTextClassName:
      'text-smallHeading leading-tight font-bold text-normalText w-10/12 font-bodyFont',
    slideHeadingClassName:
      'text-subheadline font-semibold text-normalSubHeadline mb-content font-titleFont',
    textContainerClassName: 'mt-contentTop font-titleFont',
  },
];

export const mobileVariations: ISlideVariation[] = [
  {
    type: 'central',
    containerClassName:
      'size-full flex flex-col items-center pt-10 justify-center overflow-y-auto overflow-x-hidden h-full w-full',
    plainTextClassName:
      'leading-tight font-bold text-normalText text-4xl text-center font-bodyFont w-full',
    slideHeadingClassName:
      'text-base font-semibold text-normalSubHeadline mb-presentation font-titleFont w-full',
  },
  {
    type: 'left',
    containerClassName: 'size-full flex flex-col pt-10',
    plainTextClassName:
      'text-heading text-left leading-9 font-bold text-normalText text-3xl w-10/12 font-bodyFont w-full',
    slideHeadingClassName:
      'text-base font-semibold text-normalSubHeadline mb-content font-titleFont overflow-y-auto',
    textContainerClassName: 'mt-contentTop flex w-full',
  },
];

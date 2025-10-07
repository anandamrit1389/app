import { ISlideVariation } from '@/interfaces/ISlideVariation';

export const variations: ISlideVariation[] = [
  {
    type: '3/2',
    slideHeadingClassName:
      'text-center text-sectionHeading text-sectionHeading font-bold pb-contentBottom w-8/12 font-titleFont',
    imageClassName: 'object-cover aspect-3/2',
    imageCaptionHeadingClassName:
      'font-semibold text-smallSubHeadline text-smallSubHeadlineSize font-titleFont',
    imageCaptionClassName: 'text-normalTextFontSize text-normalText font-bodyFont',
    textContainerClassName: 'mt-2',
  },
  {
    type: '16/9',
    slideHeadingClassName:
      'text-center text-sectionHeading text-sectionHeading font-bold pb-contentBottom w-8/12 font-titleFont',
    imageClassName: 'w-full aspect-[16/9]',
    imageCaptionHeadingClassName:
      'font-semibold text-smallSubHeadline text-smallSubHeadlineSize font-titleFont',
    imageCaptionClassName: 'text-normalTextFontSize text-normalText',
    textContainerClassName: 'mt-2 font-bodyFont',
  },
  {
    type: 'full',
    slideHeadingClassName: 'hidden',
    imageClassName: 'object-cover size-full',
    imageCaptionHeadingClassName:
      'font-semibold text-white text-smallSubHeadlineSize font-titleFont w-[80%]',
    imageCaptionClassName: 'text-normalTextFontSize text-white w-[80%]',
    imageContainerClassName: 'size-full',
    containerClassName: 'w-full relative overflow-hidden',
    textContainerClassName:
      'font-bodyFont absolute flex flex-col justify-end bottom-0 left-0 p-content h-1/2 w-[125%] bg-gradient-to-bl from-transparent from-15% via-transparent to-black to-85%',
  },
];

export const mobileVariations: ISlideVariation[] = [
  {
    type: '3/2',
    slideHeadingClassName:
      'text-sectionHeading font-bold pb-contentBottom w-11/12 font-titleFont max-sm:text-[28px]',
    imageClassName: 'aspect-[3/2] object-cover',
    imageCaptionHeadingClassName:
      'font-semibold text-smallSubHeadline text-smallSubHeadlineSize font-titleFont',
    imageCaptionClassName: 'text-sm text-normalText',
    textContainerClassName: 'w-2/3 font-bodyFont',
    containerClassName: 'flex gap-3 w-full mb-content',
    imageContainerClassName: 'w-1/3',
  },
  {
    type: '16/9',
    slideHeadingClassName:
      'text-sectionHeading font-bold pb-contentBottom w-11/12 font-titleFont max-sm:text-[28px]',
    imageClassName: 'aspect-video object-cover',
    imageCaptionHeadingClassName:
      'font-semibold text-smallSubHeadline text-smallSubHeadlineSize font-titleFont',
    imageCaptionClassName: 'text-sm text-normalText',
    textContainerClassName: 'w-2/3 font-bodyFont',
    containerClassName: 'flex gap-3 w-full mb-content',
    imageContainerClassName: 'w-1/3 ',
  },
  {
    type: 'full',
    slideHeadingClassName: 'hidden',
    imageClassName: 'object-cover size-full',
    imageCaptionHeadingClassName:
      'font-semibold text-white text-smallSubHeadlineSize font-titleFont w-[80%]',
    imageCaptionClassName: 'text-normalTextFontSize text-white w-[80%]',
    imageContainerClassName: 'size-full',
    containerClassName: 'w-full relative overflow-hidden h-1/3',
    textContainerClassName:
      'font-bodyFont absolute flex flex-col justify-end bottom-0 left-0 p-content h-1/2 w-[125%] bg-gradient-to-bl from-transparent from-15% via-transparent to-black to-85%',
  },
];

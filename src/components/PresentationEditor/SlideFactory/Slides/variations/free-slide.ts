import { ISlideVariation } from '@/interfaces/ISlideVariation';

export const variations: ISlideVariation[] = [
  {
    type: 'full',
    slideHeadingClassName: 'hidden',
    imageClassName: 'object-cover size-full',
    imageCaptionHeadingClassName:
      'font-semibold text-white text-smallSubHeadlineSize font-titleFont w-[80%]',
    imageCaptionClassName: 'text-normalTextFontSize text-white w-[80%]',
    imageContainerClassName: 'size-full',
    containerClassName: 'w-full relative',
    textContainerClassName:
      'font-bodyFont absolute flex flex-col justify-end bottom-0 left-0 p-content h-1/2 w-[125%] bg-gradient-to-bl from-transparent from-15% via-transparent to-black to-85%',
  },
];
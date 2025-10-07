import { ISlideVariation } from '@/interfaces/ISlideVariation';

export const variations: ISlideVariation[] = [
  {
    type: 'center',
    containerClassName: 'items-center justify-center size-full text-center bg-sectionBg',
    imageClassName: 'aspect-video opacity-[0.7]',
    imageContainerClassName: 'absolute w-full max-h-full overflow-hidden',
    plainTextClassName:
      'text-titleOnImage leading-tight tracking-tight text-heading font-bold text-center',
    textContainerClassName: 'w-10/12 z-10 bg-transparent font-titleFont',
  },
  {
    type: 'left',
    containerClassName: 'items-center justify-start size-full text-center bg-sectionBg',
    imageClassName: 'aspect-video opacity-[0.7]',
    imageContainerClassName: 'absolute aspect-video w-full max-h-full overflow-hidden',
    plainTextClassName: 'text-titleOnImage leading-tight text-heading font-bold',
    textContainerClassName: 'w-10/12 ps-presentation z-20 font-titleFont',
  },
  {
    type: 'left-without',
    containerClassName: 'size-full bg-sectionBg',
    imageClassName: '',
    imageContainerClassName: 'hidden',
    plainTextClassName: 'text-titleText leading-tight text-heading font-bold',
    textContainerClassName: 'flex w-10/12 ps-presentation items-center z-20 font-titleFont',
  },
  {
    type: 'center-without',
    containerClassName: 'items-center justify-center size-full text-center bg-sectionBg',
    imageClassName: 'aspect-video opacity-[0.7]',
    imageContainerClassName: 'hidden',
    plainTextClassName:
      'text-titleText leading-tight tracking-tight text-heading font-bold text-center',
    textContainerClassName: 'w-10/12 z-10 bg-transparent font-titleFont',
  },
];

export const mobileVariations: ISlideVariation[] = [
  {
    type: 'center',
    containerClassName: 'items-center justify-center size-full text-center bg-titleText',
    imageClassName: 'opacity-[0.7] h-full',
    imageContainerClassName: 'absolute w-full h-full overflow-hidden',
    plainTextClassName:
      'text-titleOnImage leading-tight tracking-tight text-title font-extrabold  text-center',
    textContainerClassName: 'w-10/12 z-10 bg-transparent font-titleFont',
  },
  {
    type: 'left',
    containerClassName: 'items-center justify-start text-start bg-titleText',
    imageClassName: 'h-full',
    imageContainerClassName: 'absolute h-full z-10 overflow-hidden',
    plainTextClassName: 'text-titleOnImage leading-tight text-heading font-extrabold',
    textContainerClassName: 'w-10/12 ps-presentation z-20 font-titleFont',
  },
  {
    type: 'left-without',
    containerClassName: 'size-full bg-titleBg',
    imageClassName: '',
    imageContainerClassName: 'hidden',
    plainTextClassName: 'leading-tight text-heading font-extrabold',
    textContainerClassName: 'flex w-10/12 ps-presentation items-center z-20 font-titleFont',
  },
];

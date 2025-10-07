import { ISlideVariation } from '@/interfaces/ISlideVariation';

export const variations: ISlideVariation[] = [
  {
    type: 'center',
    containerClassName: 'items-center justify-center size-full text-center bg-deepBlack',
    imageClassName: 'aspect-video opacity-[0.7]',
    imageContainerClassName: 'absolute w-full max-h-full overflow-hidden',
    slideHeadingClassName:
      'text-titleOnImage tracking-tight text-title font-extrabold text-center font-titleFont',
    textContainerClassName: 'w-10/12 z-10 bg-transparent',
  },
  {
    type: 'bottom',
    containerClassName: 'items-end size-full relative overflow-hidden',
    imageClassName: 'aspect-video',
    imageContainerClassName: 'absolute w-full aspect-video overflow-hidden ',
    slideHeadingClassName: 'text-titleOnImage text-title font-extrabold w-4/6',
    textContainerClassName:
      'flex w-[120%] ps-presentation items-end z-5 pb-contentTop !bg-gradient-to-bl from-transparent to-black via-transparent h-2/3 font-titleFont absolute',
  },
  {
    type: 'bottomWithout',
    containerClassName: 'bg-titleBg items-end relative flex flex-row-reverse p-presentation',
    slideHeadingClassName: 'text-titleText text-title font-extrabold pe-presentation',
    imageContainerClassName: 'w-4/12 h-full p-presentation',
    imageClassName: 'size-full',
    textContainerClassName: 'w-8/12 font-titleFont pb-contentTop pr-contentTop',
  },
  {
    type: 'bottomRightWithout',
    containerClassName: 'bg-titleBg items-end relative flex p-presentation',
    slideHeadingClassName: 'text-titleText text-title font-extrabold ps-presentation',
    imageContainerClassName: 'w-4/12 h-full',
    imageClassName: 'z-10 size-full',
    textContainerClassName: 'w-8/12 ps-presentation font-titleFont',
  },
  {
    type: 'businessSubtitleLeft',
    containerClassName: 'items-center size-full bg-deepBlack',
    imageClassName: 'aspect-video opacity-[0.7]',
    imageContainerClassName: 'absolute w-full max-h-full overflow-hidden',
    slideHeadingClassName:
      'text-titleOnImage tracking-tight text-title font-bold font-titleFont p-content',
    plainTextClassName:
      'text-headline ml-content text-white tracking-tight font-bodyFont text-normalTextFontSize',
    subtitleClassName:
      'text-headline text-white ml-content tracking-tight text-headingFontSize font-bodyFont text-subheadline font-semibold mt-content',
    textContainerClassName: 'w-8/12 z-10 bg-transparent mt-contentTop pl-content',
    titleDecoration: 'pl-content'
  },
  {
    type: 'businessLeft',
    containerClassName: 'items-center size-full bg-deepBlack',
    imageClassName: 'aspect-video opacity-[0.7]',
    imageContainerClassName: 'absolute w-full max-h-full overflow-hidden',
    slideHeadingClassName:
      'text-headline text-white tracking-tight text-heading font-bold font-titleFont ml-content',
    plainTextClassName:
      'text-headline text-white ml-content tracking-tight font-bodyFont text-normalTextFontSize',
    textContainerClassName: 'w-8/12 z-10 bg-transparent mt-contentTop pl-content',
    titleDecoration: 'pl-content py-content'
  },
  {
    type: 'businessSubtitleCenter',
    containerClassName: 'items-center justify-center size-full text-center bg-deepBlack',
    imageClassName: 'aspect-video opacity-[0.7]',
    imageContainerClassName: 'absolute w-full max-h-full overflow-hidden',
    slideHeadingClassName:
      'text-headline text-white tracking-tight text-title font-extrabold font-titleFont text-center',
    plainTextClassName:
      'text-headline text-white tracking-tight font-bodyFont text-normalTextFontSize text-center',
    textContainerClassName: 'w-8/12 z-10 bg-transparent',
    subtitleClassName:
      'text-headline text-center text-white tracking-tight text-headingFontSize font-bodyFont text-subheadline font-semibold mt-content',
    titleDecoration: 'flex justify-center'
  },
  {
    type: 'businessCenter',
    containerClassName: 'items-center justify-center size-full text-center bg-deepBlack',
    imageClassName: 'aspect-video opacity-[0.7]',
    imageContainerClassName: 'absolute w-full max-h-full overflow-hidden',
    slideHeadingClassName:
      'text-headline text-white tracking-tight text-heading font-bold text-center font-titleFont',
    plainTextClassName:
      'text-headline text-white tracking-tight text-center text-base text-normalTextFontSize font-bodyFont',
    textContainerClassName: 'w-8/12 z-10 bg-transparent',
    titleDecoration: 'flex justify-center py-content'
  },
  {
    type: 'businessLeftBoldWithout',
    containerClassName: 'size-full bg-deepBlack',
    imageClassName: 'aspect-video opacity-[0.7]',
    imageContainerClassName: 'absolute w-full max-h-full overflow-hidden',
    slideHeadingClassName:
      'text-titleOnImage mt-contentTop tracking-tight text-title font-extrabold font-titleFont',
    plainTextClassName:
      'text-titleOnImage mb-contentTop tracking-tight text-normalText text-base text-normalTextFontSize font-bodyFont w-2/3',
    textContainerClassName: 'w-8/12 z-10 bg-transparent flex flex-col justify-between ml-content',
  },
  {
    type: 'businessLeftWithout',
    containerClassName: 'size-full bg-deepBlack',
    imageClassName: 'aspect-video opacity-[0.7]',
    imageContainerClassName: 'absolute w-full max-h-full overflow-hidden',
    slideHeadingClassName:
      'text-titleOnImage mt-contentTop tracking-tight text-heading font-bold font-titleFont',
    plainTextClassName:
      'text-titleOnImage mb-contentTop tracking-tight text-normalText text-base text-normalTextFontSize font-bodyFont w-2/3',
    textContainerClassName: 'w-8/12 z-10 bg-transparent flex flex-col justify-between ml-content',
  },
  {
    type: 'businessDiagonalBoldWithout',
    containerClassName: 'size-full bg-deepBlack',
    imageClassName: 'aspect-video opacity-[0.7]',
    imageContainerClassName: 'absolute w-full max-h-full overflow-hidden',
    slideHeadingClassName:
      'w-1/2 text-titleOnImage mt-contentTop tracking-tight text-title font-extrabold font-titleFont',
    plainTextClassName:
      'w-1/2 self-end text-titleOnImage mb-contentTop tracking-tight text-normalText text-base text-normalTextFontSize font-bodyFont',
    textContainerClassName: 'w-full z-10 bg-transparent flex flex-col justify-between mx-content',
  },
  {
    type: 'businessDiagonalWithout',
    containerClassName: 'size-full bg-deepBlack',
    imageClassName: 'aspect-video opacity-[0.7]',
    imageContainerClassName: 'absolute w-full max-h-full overflow-hidden',
    slideHeadingClassName:
      'w-1/2 text-titleOnImage mt-contentTop tracking-tight text-heading font-bold font-titleFont',
    plainTextClassName:
      'w-1/2 self-end text-titleOnImage mb-contentTop tracking-tight text-normalText text-base text-normalTextFontSize font-bodyFont',
    textContainerClassName: 'w-full z-10 bg-transparent flex flex-col justify-between mx-content',
  },
];

export const mobileVariations: ISlideVariation[] = [
  {
    type: 'center',
    containerClassName: 'items-center justify-center size-full text-center bg-deepBlack',
    imageClassName: 'h-full opacity-[0.7]',
    imageContainerClassName: 'absolute w-full h-full overflow-hidden',
    slideHeadingClassName:
      'w-full break-words text-titleOnImage leading-[52px] sm:leading-tight text-[52px] sm:text-title tracking-tight font-extrabold  text-center',
    textContainerClassName: 'w-full px-4 z-10 bg-transparent font-titleFont',
  },
  {
    type: 'bottom',
    containerClassName: 'items-end size-full relative overflow-hidden',
    imageClassName: 'h-full',
    imageContainerClassName: 'absolute h-full w-full overflow-hidden',
    slideHeadingClassName:
      'break-words text-titleOnImage leading-10 sm:leading-tight text-[40px] sm:text-title font-extrabold w-5/6',
    textContainerClassName:
      'font-bodyFont ps-presentation flex items-end z-10 h-2/3 w-[120%] bg-gradient-to-bl from-transparent from-15% via-transparent to-black to-95%',
  },
  {
    type: 'bottomWithout',
    containerClassName: 'relative flex flex-col h-full bg-titleBg px-[16px]',
    slideHeadingClassName: 'text-titleText leading-tight text-title font-extrabold overflow-auto',
    imageContainerClassName: 'w-full h-[347px] mt-[112px]',
    imageClassName: 'w-full h-[347px] object-cover',
    textContainerClassName: 'w-full font-titleFont flex items-start mt-[16px] overflow-auto',
  },
  {
    type: 'bottomRightWithout',
    containerClassName: 'relative flex flex-col h-full bg-titleBg px-[16px]',
    slideHeadingClassName: 'text-titleText leading-tight text-title font-extrabold overflow-auto',
    imageContainerClassName: 'w-full h-[347px] mt-[112px]',
    imageClassName: 'w-full h-[347px] object-cover',
    textContainerClassName: 'w-full font-titleFont flex items-start mt-[16px] overflow-auto',
  },
];

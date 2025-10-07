import { ISlideVariation } from '@/interfaces/ISlideVariation';

export const tableVariations: ISlideVariation[] = [
  {
    type: 'default',
    imageClassName: 'hidden',
    plainTextClassName: 'text-shapeText text-bodySm font-semibold font-light',
    subtitleClassName: 'text-normalText text-subheadline font-titleFont',
    slideHeadingClassName: 'text-headline font-semibold text-smallHeading mb-content font-titleFont',
    textContainerClassName: 'w-full',
    containerClassName: 'w-full h-[90%] mt-content flex justify-between',
    contentSubtitleClassName: 'font-semibold',
    pageContainerClassName: 'p-presentation w-full h-full pt-contentTop pb-contentTop',
    bulletPointClassName: 'hidden',
    tableClassName: 'w-full rounded-lg h-[60%]',
    tableHeaderClassName:
      'bg-shape px-simpleTableX py-simpleTableY text-left text-headline font-semibold border border-tableBorder border-b-2',
    tableCellClassName: 'px-simpleTableX py-simpleTableY border border-tableBorder text-left text-shapeText',
    imageContainerClassName: 'hidden',
    layoutContainerClassName: 'w-full',
  },
];

export const mobileTableVariations: ISlideVariation[] = [
  {
    type: 'default',
    imageClassName: 'hidden',
    plainTextClassName: 'text-normalText text-base sm:text-normalTextFontSize font-bodyFont font-normal',
    slideHeadingClassName: 'text-headline font-bold sm:text-smallHeading mb-content font-titleFont',
    subtitleClassName: 'text-normalText text-smallSubHeadlineSize font-titleFont',
    textContainerClassName: 'w-full',
    containerClassName: 'w-full overflow-x-auto mt-content',
    contentSubtitleClassName: 'text-xs text-gray-500 text-left',
    pageContainerClassName: 'p-content',
    bulletPointClassName: 'hidden',
    tableClassName: 'w-full border-collapse min-w-[400px]',
    tableHeaderClassName:
      'bg-shape px-simpleTableX py-simpleTableY text-left font-medium text-black border border-gray-200 border-b-2',
    tableCellClassName: 'px-simpleTableX py-simpleTableY border border-gray-200 text-gray-800 bg-white text-left',
    tableRowClassName: '',
    imageContainerClassName: 'hidden',
    layoutContainerClassName: 'w-full',
  },
];

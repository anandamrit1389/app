import { Category } from '@/helpers/constants/text-limits.const';
import { ISlide } from '@/interfaces/ISlides';

export interface IBaseResult {
  result: string;
  resultId: string;
  contentId?: string;
  slideId: string;
  color: string;
}

export interface ITextResult extends IBaseResult {
  key: 'title' | 'text' | 'subtitle' | 'cell';
  type: 'text';
  text: string;
  sentencesMax?: number;
  min?: number;
  max?: number;
  rowIndex?: number;
  colIndex?: number;
}

export interface IImageResult extends IBaseResult {
  type: 'image';
  image: string;
}

export interface IUnparsedSlideResult extends IBaseResult {
  type: 'unparsed_image';
}

export interface IBulletSlideResult extends IBaseResult {
  type: 'bullets';
  bulletSuggestion: BulletSuggestion;
  count?: number;
}

export interface ITableSlideResult extends IBaseResult {
  type: 'table';
  tableSuggestion: TableSuggestion;
  index: number;
}

export type TableSuggestion = 'removeCol' | 'removeRow';

export type BulletSuggestion = 'convertToText' | 'splitSlide';

export type IResult =
  | ITextResult
  | IImageResult
  | IUnparsedSlideResult
  | IBulletSlideResult
  | ITableSlideResult;

export interface IBrokenSlide {
  slideId: string;
  slideNumber: number;
  result: IResult;
}

export interface IUseSlideAnalytics {
  result: IBrokenSlide[];
  handleFix: (toFix: IBrokenSlide, index: number) => void;
  loading: boolean;
  loadElement: string[];
  handleFixAllSlide: (slideToImprove: IBrokenSlide[]) => void;
  onUpscale: (result: IImageResult, index: number) => void;
  getSlideImprovements: (slideNumber?: number) => IBrokenSlide[];
  isSlideParsed: (slideNumber?: number) => boolean;
  handleRemoveImprovement: (slideId: string, slideNumber: number, resultId: string) => void;
}

export type CheckFunction = (
  slide: ISlide,
  textAmount: Category,
  langId: string,
) => IResult[] | Promise<IResult[]>;

import {
  ChartData,
  ChartType,
} from '@/components/PresentationEditor/SlideFactory/Slides/ChartSlide';
import { PresentationAccess, SlideTransition } from './IPresentation';
import { FontScheme } from './font.interface';
import { ThemeSchema } from './theme.interface';
import { ImageStyleSlug } from './images-styles.interface';
import { TableData } from '@/components/PresentationEditor/SlideFactory/Slides/SimpleTable';

export type Scope = 'personal' | 'team';

export interface ITemplate extends IPresentation {
  templateKey: string;
  roundingSize?: string;
  roundingSizePreview?: string;
  coverBg?: string;
  sectionBg?: string;
  agendaBg?: string;
  hideTitleImage?: boolean;
}

export interface IPresentation {
  id: string;
  themeId: string;
  fontFamily: string;
  description: string;
  numberOfSlides: number;
  slideTransition: SlideTransition;
  slides: ISlide[];
  title: string;
  titleTranslations: Record<string, string>;
  imageStyle: ImageStyleSlug;
  authorName?: string;
  generationFinished?: boolean;
  logotype?: string;
  language: string;
  translatedLanguages: string[];
  logotypeKey?: string;
  keyWords?: string;
  accessPassword?: string;
  voiceId?: string;
  showAgenda?: boolean;
  showTitle?: boolean;
  showPages?: boolean;
  showWatermark?: boolean;
  showEndScreen?: boolean;
  textAmount: string;
  extraFonts: FontScheme[];
  extraThemes: ThemeSchema[];
  template: string;
  accessType?: PresentationAccess;
  speachMode?: boolean;
  isDeleted?: boolean;
  isFavourite?: boolean;
  alias?: string;
  readonly: boolean;
  workspace?: Scope;
}

export interface ISlide {
  id: string;
  slideNumber: number; //to alow slide ordering;
  slideType: SlideTypes;
  withoutHeader?: boolean;
  variation: string;
  title: string;
  titleTranslations: Record<string, string>;
  subtitle?: string;
  subtitleTranslations: Record<string, string>;
  accentImageAlign?: ImageAligns;
  focusPointX?: number;
  focusPointY?: number;
  imageFit?: ImageFit;
  scale?: number;
  accentImage?: string;
  accentImageKey?: string | null;
  accentImageGeneratedAt?: Date | null;
  content: IContent[];
  chartType?: ChartType | null;
  chartData?: ChartData[][] | null;
  tableData?: TableData[] | null;
  tableDataTranslations?: Record<string, TableData[]>;
  description?: string;
  generationFinished?: boolean;
  skipSlide?: boolean;
  audio?: string | null;
  speakerNotes?: string;
  accentImageKeyword?: string;
  accentImageWidth?: number;
  accentImageHeight?: number;
  dimmedImage?: boolean;
  themeId?: string | null;
  hiddenSlideImprovements?: HiddenSlideImprovement[];
  backgroundProperties?: string | null;
}

export interface IAddSlideOptions {
  type: string;
  prompt?: string;
  index?: number;
  importedChartData?: ChartData[][];
  title?: string;
}

export interface ISlideWithChartData extends Omit<ISlide, 'chartData'> {
  chartData?: ChartData[][] | null;
  chartType: ChartType;
}

export interface IPrettifyOutlineSlide {
  title: string;
  description: string;
  slideType: SlideTypes;
  variation: string;
  image: {
    imageUrl: string;
    imageKey: string;
  };
}

export interface IPrettifyOutlineData {
  slides: IPrettifyOutlineSlide[];
  language: string;
  alias: string;
}

export interface HiddenSlideImprovement {
  id: string;
  slideNumber: number;
  content: string;
  slideId: string;
}

export interface IContent {
  id: string;
  contentType: 'text' | 'image' | 'list-item' | 'card' | 'side-bar' | 'user-icon' | 'shape';
  title?: string;
  titleTranslations: Record<string, string>;
  subtitle?: string;
  subtitleTranslations: Record<string, string>;
  text?: string;
  textTranslations: Record<string, string>;
  imageAlign?: ImageAligns;
  focusPointX?: number;
  focusPointY?: number;
  imageFit?: ImageFit;
  scale?: number;
  image?: string | null;
  imageKey?: string | null;
  imageGeneratedAt?: Date | null;
  sortOrder: number; //to allow content ordering
  imageKeyword?: string;
  imageWidth?: number;
  imageHeight?: number;
  position?: string;
}

export type ImageAligns =
  | 'object-bottom'
  | 'object-center'
  | 'object-top'
  | 'object-left'
  | 'object-right'
  | 'object-left-bottom'
  | 'object-left-top'
  | 'object-right-bottom'
  | 'object-right-top';

export type ImageFit = 'cover' | 'fill' | 'contain';

export type SlideTypes =
  | 'title-slide'
  | 'content-slide'
  | 'closing-slide'
  | 'text-slide'
  | 'image-text-slide'
  | 'image-caption-slide'
  | 'images-slide'
  | 'important-text-slide'
  | 'section-headline-slide'
  | 'bullet-points-slide'
  | 'shapes-slide'
  | 'chart-slide'
  | 'table-slide'
  | 'free-slide'
  | 'screen-slide';

export interface ISlideGenerator {
  slideNumber: number;
  content: ISlideGeneratorElement[];
  slideType: string;
  backgroundColor?: string | null;
  backgroundImage?: string | null;
}

export interface ISlideGeneratorElement {
  layoutType: string;
  singleItemType: string;
  styles: ISlideGeneratorStyles;
  content?: string;
  contentBlob?: string;
  containerType?: string;
}

export interface ISlideGeneratorStyles {
  position: string;
  x: string;
  y: string;
  width: string;
  height: string;
  textAlign: string;
  backgroundColor: string;
  borderRadius: number;
  fontSize: string;
  fontSizePx: string;
  fontWeight: string;
  z: string;
  color: string;
  fontFamily: string;
  objectPosition?: string;
}

export interface IAxiosResponse<T> {
  data: T;
}

export interface IImproveSlideRequest {
  slideId: string;
  presentationId: string;
  contentId?: string;
  key?: 'title' | 'text' | 'subtitle' | 'image' | 'unparsed_image';
  text?: string;
  type: 'shorter-text' | 'longer-text' | 'image';
  description?: string;
  min?: number;
  max?: number;
  sentencesMax?: number;
}

export interface IImproveSlideImageContent {
  imageUrl: string;
  imageKey: string;
}

export interface IImproveSlideResponse {
  slideId: string;
  contentId?: string;
  key: 'title' | 'text' | 'subtitle' | 'image';
  content: string | IImproveSlideImageContent;
}

export interface IImproveAllSlidesResponse {
  success: boolean;
  message: string;
  data: IImproveSlideResponse[];
}

export interface UsePresentationImage {
  loadingImageContentId: null | string;
  loadingImageSlideId: null | string;
  generateImage: (
    prompt: string,
    slideId: string,
    contentId?: string,
    style?: string,
  ) => Promise<void>;
  handleImageUpload: (file: File, slideId: string, contentId?: string) => Promise<void>;
}

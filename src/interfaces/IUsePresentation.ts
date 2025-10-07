import { FontScheme } from './font.interface';
import { PresentationAccess, SlideTransition } from './IPresentation';
import {
  IAddSlideOptions,
  HiddenSlideImprovement,
  IContent,
  IPresentation,
  ISlide,
  ITemplate,
  UsePresentationImage,
} from './ISlides';
import { ThemeSchema } from './theme.interface';
import { ICurrentElement } from './IUseAnimatedText';
export interface IUsePresentation extends UsePresentationImage {
  presentation: IPresentation | null;
  addSlide: (slideOptions: IAddSlideOptions) => Promise<void>;
  updateSlide: (slide: ISlide, key?: keyof ISlide) => void;
  activeSlide?: ISlide;
  countAgendaSlides: number;
  setActiveSlide: (slide: ISlide) => void;
  setSelectedLanguage: (lang: string) => void;
  selectedLanguage: string;
  originLanguage: string;
  changeActiveSlide: (slideId: string | ISlide) => void;
  onExport: (type: string) => void;
  deleteItem: (id: string) => void;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
  changeSlideVariant: (variant: string) => void;
  moveItem: (id: string, moveUp?: boolean) => void;
  splitContentAsImportant: (id: string) => void;
  showSideBar: (val?: string) => void;
  isSideBarActive: boolean;
  setIsSideBarActive: (val: boolean) => void;
  present: () => void;
  isFullscreen: boolean;
  showUploadModal: boolean;
  setShowUploadModal: (val: boolean) => void;
  currentSideBarType: string;
  updatePresentationTitle: (val: string) => void;
  updatePresentationDescription: (val: string) => void;
  updatePresentationVoice: (voiceId: string) => void;
  showPages: boolean;
  changeShowPages: () => void;
  showWatermark: boolean;
  changeShowWatermark: () => void;
  file: File | null;
  tempUrl: string;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeLogo: () => void;
  createContent: (contentType: string, variation?: string, width?: string) => void;
  deleteContent: (id: string) => void;
  deleteSlide: (id?: string) => void;
  cloneSlide: (id: string) => void;
  slideAlternatives?: ISlideAlternatives[];
  getPresentation: (id: string) => Promise<void>;
  loading: boolean;
  theme: string;
  toggleTheme: (theme: string) => void;
  themes: ThemeSchema[];
  extraThemes: ThemeSchema[];
  template: string;
  presentationTemplateInfo: ITemplate | undefined;
  toggleTemplate: (template: string) => void;
  transitionOptions: ITransition[];
  fontFamily: string;
  setFontFamily: (font: string) => void;
  slideTransition: SlideTransition;
  setSlideTransition: (val: SlideTransition) => void;
  updateAuthorName: (authorName: string) => void;
  presentationFonts: FontScheme[];
  extraFonts: FontScheme[];
  handleUndoAction: () => void;
  handleRedoAction: () => void;
  showDeleteConfirmation: boolean;
  setShowDeleteConfirmation: (val: boolean) => void;
  confirmDelete: () => void;
  slidesRef: React.MutableRefObject<HTMLDivElement[]>;
  exportingPDF: boolean;
  exportingPPTX: boolean;
  exportingSlides: boolean;
  exportingPDFForPrint: boolean;
  updateSlidesOrder: (slides: ISlide[]) => void;
  skipSlide: (id: string) => void;
  setActiveImage: (val: IActiveElement | null) => void;
  setReferenceImage: (val: ITransformImage | null) => void;
  referenceImage: ITransformImage | null;
  changeImageFromStock: (
    src: string,
    key?: string,
    imageUrlGeneratedAt?: Date,
    slideId?: string,
    contentId?: string,
  ) => void;
  activeImage: IActiveElement | null;
  readonly: boolean;
  voices: IVoice[];
  handleUpdateSlide: (slide: ISlide) => void;
  handleToggleDevice: () => void;
  isDesktopMode: boolean;
  isVoicesLoading: boolean;
  handleUpdateCurrentAudio: (audio: CurrentAudio | null) => void;
  currentAudio: CurrentAudio | null;
  showAgenda: boolean;
  changeShowAgenda: () => void;
  showTitle: boolean;
  changeShowTitle: () => void;
  showEndScreen: boolean;
  changeShowEndScreen: () => void;
  lastGenerated: number;
  historyIndex: number;
  history?: IPresentation[];
  filterSlides: (slides: ISlide[] | undefined) => ISlide[];
  filterSkippedSlides: (slides: ISlide[] | undefined) => ISlide[];
  updateLastGenerated: (slideNumber: number) => void;
  updateContent: (content: IContent, slideId: string) => void;
  updateAccessLevel: (value: PresentationAccess) => void;
  updateAccessPassword: (value: string) => void;
  currentElement: ICurrentElement | null;
  switchToNextElement: () => void;
  handleCopyPresentation: (presentationId: string) => void;
  isCopied: boolean;
  switchDimmedImage: (e: boolean) => void;
  slideLoading: string;
  setSlideLoading: (id: string) => void;
  handleShowMeSelectedText: (slideId: string, textToImprove: string) => void;
  onHideSelectedText: () => void;
  selectedText: string;
  getPresentationHiddenImprovements: () => HiddenSlideImprovement[];
  handleMoveLayout: (slide: ISlide, direction: 'prev' | 'next') => void;
  exportOpen: boolean;
  setExportOpen: (val: boolean) => void;
  isExporting: boolean;
  showFeedbackModal: boolean;
  closeFeedbackModal: () => void;
  feedbackPresentationId?: string;
  splitSlideByBullets: (slideId: string, maxPerSlide: number) => void;
  fontSizes: FontSizeMap;
  setFontSizes: (val: FontSizeMap) => void;
  exportingVideo: boolean;
  handleTransformImage: (prompt: string, referenceImage: ITransformImage | null) => void;
  setTransformOpen: (open: boolean) => void;
  transformOpen: boolean;
}

export interface CurrentAudio {
  audio: HTMLAudioElement;
  name: string;
}

export interface IActiveElement {
  slideId?: string;
  contentId?: string;
  key?: 'title' | 'text' | 'subtitle';
  text?: string;
  keywords?: string;
}

export interface ITransformImage {
  imageUrl: string;
  slideId: string;
  contentId?: string
}

export interface ISlideAlternatives {
  name: string;
  preview: string;
  mobile: string;
}

export interface IVoice {
  name: string;
  id: string;
  previewUrl: string;
  gender: 'male' | 'female';
}

export interface ITransition {
  label: string;
  value: SlideTransition;
}

export type FontSizeMap = Record<
  string,
  {
    title?: number;
    subtitle?: number;
    text?: number;
  }
>;

import presentationService from '@/api/presentationService';
import { IPresentation, IPrettifyOutlineSlide } from '@/interfaces/ISlides';
import { useContext, useRef, useState } from 'react';
import { getTemplates } from '@/helpers/constants/presentation-templates.const';
import { AuthContext } from '@/providers/auth.provider';
import { analyticsService } from '@/helpers/services/AnalyticsService';
import { ImageStyle } from '@/interfaces/images-styles.interface';
import { imageStylesList } from '@/components/DrawersAndSheets/ImageStyleDrawer/categories';
import { WorkspaceParam } from '@/types/workspace.type';

export type TypeParam = 'prompt' | 'youtube' | 'speaker';

export interface IUsePrettifyPage {
  templates: IPresentation[];
  loading: boolean;
  showOutlineDrawer: boolean;
  imageSource: string[];
  font: string;
  theme: string;
  template: string;
  tempUrl: string | null;
  setTempUrl: (val: string) => void;
  setFont: (font: string) => void;
  setTheme: (font: string) => void;
  setTemplate: (font: string) => void;
  updateImageSource: (val: string) => void;
  setShowOutlineDrawer: (val: boolean) => void;
  step: string;
  setStep: (step: string) => void;
  authorName: string;
  setAuthorName: (authorName: string) => void;
  title: string;
  setTitle: (title: string) => void;
  showMiddleware: boolean;
  setShowMiddleware: (show: boolean) => void;
  showPages: boolean;
  setShowPages: (show: boolean) => void;
  showWatermark: boolean;
  setShowWatermark: (show: boolean) => void;
  showEndScreen: boolean;
  setShowEndScreen: (show: boolean) => void;
  handleStartWithTemplate: () => void;
  type: TypeParam;
  setType: (val: TypeParam) => void;
  showStyleImageDrawer: boolean;
  imageStyle: string;
  setImageStyle: (val: string) => void;
  handleToggleStyleImageDrawer: () => void;
  handleChangeSelectedImageStyle: (imageStyle: ImageStyle) => void;
  selectedImageStyle: ImageStyle;
  prettifyOutline: IPrettifyOutlineSlide[];
  setPrettifyOutline: (val: IPrettifyOutlineSlide[]) => void;
  fileDataText: string;
  setFileDataText: (val: string) => void;
  handleGenerate: (isRedo?: boolean) => void;
  textAmount: string;
  setTextAmount: (val: string) => void;
  aiText: boolean;
  setAiText: (val: boolean) => void;
  aiImages: boolean;
  setAiImages: (val: boolean) => void;
  adjustSlidesNumber: boolean;
  setAdjustSlidesNumber: (val: boolean) => void;
  slidesNumber: number;
  setSlidesNumber: (val: number) => void;
  language: string;
  setLanguage: (val: string) => void;
  alias: string;
  setAlias: (val: string) => void;
  isGenerated: boolean;
  setIsGenerated: (val: boolean) => void;
  abortControllerRef: React.MutableRefObject<AbortController | null>;
  description: string;
  setDescription: (val: string) => void;
  setWorkspace: (val: WorkspaceParam) => void;
  workspace: WorkspaceParam;
  showTypePage: boolean;
  setShowTypePage: (val: boolean) => void;
}

export const usePrettifyPage = (): IUsePrettifyPage => {
  const { user } = useContext(AuthContext);

  const [prettifyOutline, setPrettifyOutline] = useState<IPrettifyOutlineSlide[]>([]);
  const [fileDataText, setFileDataText] = useState<string>('');
  const [textAmount, setTextAmount] = useState('business');
  const [aiText, setAiText] = useState(false);
  const [aiImages, setAiImages] = useState(false);
  const [adjustSlidesNumber, setAdjustSlidesNumber] = useState(false);
  const [showMiddleware, setShowMiddleware] = useState(false);
  const [showPages, setShowPages] = useState(false);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [language, setLanguage] = useState('english');
  const [theme, setTheme] = useState('light');
  const [font, setFont] = useState('inter');
  const [template, setTemplate] = useState('default');
  const [authorName, setAuthorName] = useState(user?.name ?? '');
  const [title, setTitle] = useState<string>('');
  const [step, setStep] = useState('type');
  const [tempUrl, setTempUrl] = useState<string | null>('');
  const [imageSource, setImageSource] = useState<string[]>(['AI']);
  const [loading, setloading] = useState(false);
  const [showOutlineDrawer, setShowOutlineDrawer] = useState(false);
  const [selectedImageStyle, setSelectedImageStyle] = useState<ImageStyle>(imageStylesList[0]);
  const [type, setType] = useState<TypeParam>('prompt');
  const [showWatermark, setShowWatermark] = useState<boolean>(true);
  const [showStyleImageDrawer, setShowStyleImageDrawer] = useState(false);
  const [imageStyle, setImageStyle] = useState<string>('');
  const [slidesNumber, setSlidesNumber] = useState<number>(0);
  const [alias, setAlias] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [workspace, setWorkspace] = useState<WorkspaceParam>('personal');
  const [showTypePage, setShowTypePage] = useState<boolean>(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const templates = getTemplates();

  const handleToggleStyleImageDrawer = () => {
    setShowStyleImageDrawer((prev) => !prev);
  };

  const handleChangeSelectedImageStyle = (imageStyle: ImageStyle) => {
    setSelectedImageStyle(imageStyle);
  };

  const updateImageSource = (val: string) => {
    let current = [...imageSource];

    if (current.includes(val)) {
      current = current.filter((c) => c !== val);
    } else {
      current.push(val);
    }

    setImageSource(current);
  };

  const handleStartWithTemplate = () => {
    setShowMiddleware(false);
    setShowStyleImageDrawer(false);

    if (prettifyOutline && prettifyOutline.length > 0) {
      setShowOutlineDrawer((prevState) => !prevState);
    } else {
      setloading(true);
    }
  };

  const handleGenerate = async (isRedo: boolean = false) => {
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const response = await presentationService.pretiffyPresentation(
      fileDataText,
      workspace,
      prettifyOutline,
      language,
      template,
      theme,
      font,
      description,
      authorName,
      showPages,
      showWatermark,
      showEndScreen,
      imageStyle,
      alias,
      aiText,
      aiImages,
      adjustSlidesNumber,
      isRedo,
      signal,
    );

    if (response) {
      analyticsService.trackPresentationCreation(response.id);
    }
  };

  return {
    imageStyle,
    setImageStyle,
    slidesNumber,
    setSlidesNumber,
    alias,
    setAlias,
    language,
    setLanguage,
    loading,
    setShowOutlineDrawer,
    showOutlineDrawer,
    selectedImageStyle,
    handleChangeSelectedImageStyle,
    imageSource,
    updateImageSource,
    theme,
    setTheme,
    font,
    setFont,
    template,
    setTemplate,
    tempUrl,
    setTempUrl,
    templates,
    step,
    setStep,
    showMiddleware,
    setShowMiddleware,
    showPages,
    setShowPages,
    showWatermark,
    setShowWatermark,
    authorName,
    setAuthorName,
    title,
    setTitle,
    handleStartWithTemplate,
    showEndScreen,
    setShowEndScreen,
    type,
    setType,
    showStyleImageDrawer,
    handleToggleStyleImageDrawer,
    prettifyOutline,
    setPrettifyOutline,
    fileDataText,
    setFileDataText,
    handleGenerate,
    textAmount,
    setTextAmount,
    setAiText,
    aiText,
    setAiImages,
    aiImages,
    adjustSlidesNumber,
    setAdjustSlidesNumber,
    isGenerated,
    setIsGenerated,
    abortControllerRef,
    description,
    setDescription,
    setWorkspace,
    workspace,
    showTypePage,
    setShowTypePage
  };
};

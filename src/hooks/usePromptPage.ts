import presentationService from '@/api/presentationService';
import { IPresentation, ISlide } from '@/interfaces/ISlides';
import { useContext, useEffect, useState } from 'react';
import { DocData } from './useImportFile';
import useLocaleNavigate from './useLocaleNavigate';
import { getTemplates } from '@/helpers/constants/presentation-templates.const';
import { AuthContext } from '@/providers/auth.provider';
import { imageStylesList } from '@/components/DrawersAndSheets/ImageStyleDrawer/categories';
import { ImageStyle } from '@/interfaces/images-styles.interface';
import { useInfoModal } from './useInfoModal';
import { analyticsService } from '@/helpers/services/AnalyticsService';
import { DEFAULT_SLIDES_COUNT } from '@/helpers/constants/prompt.const';
import { WorkspaceParam } from '@/types/workspace.type';

export type TypeParam = 'prompt' | 'youtube' | 'speaker';

export interface IUsePromptPage {
  templates: IPresentation[];
  documentLoading: boolean;
  loading: boolean;
  showContextModal: boolean;
  showCreateConfirmation: boolean;
  promptContext: string[];
  outlineInstructions: string[];
  keepCopy: boolean;
  showOutlineDrawer: boolean;
  presentationOutline: ISlide[];
  prompt: string;
  language: string;
  textAmount: string;
  imageSource: string[];
  showUrlModal: boolean;
  importUrl: string[];
  importDocument: DocData[];
  importSlides: DocData[];
  importSheet: DocData[];
  showUploadModal: boolean;
  font: string;
  theme: string;
  template: string;
  setFont: (font: string) => void;
  setTheme: (font: string) => void;
  setTemplate: (font: string) => void;
  setShowUploadModal: (val: boolean) => void;
  addImportSheet: (val: DocData) => void;
  addImportDocument: (val: DocData) => void;
  addImportSlide: (val: DocData) => void;
  addImportUrl: (val: string) => void;
  addOutlineInstructions: (val: string[]) => void;
  setkeepCopy: (val: boolean) => void;
  removeImportUrl: (val: string) => void;
  removeImportedDoc: (val: string) => void;
  removeImportedSheet: (val: string) => void;
  removeImportedSlides: (val: string) => void;
  setShowUrlModal: (val: boolean) => void;
  setShowCreateConfirmation: (val: boolean) => void;
  updateImageSource: (val: string) => void;
  setTextAmount: (val: string) => void;
  handleLanguageChange: (lang: string) => void;
  handleGenerate: () => void;
  addPromptContext: (val: string) => void;
  removePromptContext: (val: string) => void;
  handleGenerateOutline: () => void;
  setPrompt: (val: string) => void;
  setShowContextModal: (val: boolean) => void;
  setPresentationOutline: (val: ISlide[]) => void;
  setShowOutlineDrawer: (val: boolean) => void;
  setDocumentLoading: (val: boolean) => void;
  updateSlidesOrder: (slides: ISlide[]) => void;
  updateSlidesCount: (count: number) => void;
  selectedSlidesCount: number;
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
  setWorkspace: (val: WorkspaceParam) => void;
  workspace: WorkspaceParam;
  showStyleImageDrawer: boolean;
  handleToggleStyleImageDrawer: () => void;
  handleChangeSelectedImageStyle: (imageStyle: ImageStyle) => void;
  selectedImageStyle: ImageStyle;
}

export const usePromptPage = (): IUsePromptPage => {
  const navigate = useLocaleNavigate();
  const { user } = useContext(AuthContext);
  const { onShowInfo } = useInfoModal();

  const [prompt, setPrompt] = useState('');
  const [promptContext, setPromptContext] = useState<string[]>([]);
  const [outlineInstructions, setOutlineInstructions] = useState<string[]>([]);
  const [keepCopy, setkeepCopy] = useState<boolean>(false);
  const [importUrl, setImportUrl] = useState<string[]>([]);
  const [importDocument, setImportDocument] = useState<DocData[]>([]);
  const [importSlides, setImportSlides] = useState<DocData[]>([]);
  const [importSheet, setImportSheet] = useState<DocData[]>([]);

  const [showMiddleware, setShowMiddleware] = useState(false);
  const [showPages, setShowPages] = useState(false);
  const [showEndScreen, setShowEndScreen] = useState(true);
  const [theme, setTheme] = useState('light');
  const [font, setFont] = useState('inter');
  const [template, setTemplate] = useState('default');
  const [authorName, setAuthorName] = useState(user?.name ?? '');
  const [title, setTitle] = useState('');
  const [step, setStep] = useState('template');

  const [language, setLanguage] = useState('english');
  const [textAmount, setTextAmount] = useState('keynote');
  const [selectedSlidesCount, setSelectedSlidesCount] = useState(DEFAULT_SLIDES_COUNT);
  const [imageSource, setImageSource] = useState<string[]>(['AI']);

  const [documentLoading, setDocumentLoading] = useState(false);
  const [loading, setloading] = useState(false);
  const [showContextModal, setShowContextModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateConfirmation, setShowCreateConfirmation] = useState(false);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [showOutlineDrawer, setShowOutlineDrawer] = useState(false);
  const [type, setType] = useState<TypeParam>('prompt');
  const [workspace, setWorkspace] = useState<WorkspaceParam>('personal');
  const [showWatermark, setShowWatermark] = useState<boolean>(true);
  const [description, setDescription] = useState<string>('');

  const [showStyleImageDrawer, setShowStyleImageDrawer] = useState(false);
  const [selectedImageStyle, setSelectedImageStyle] = useState<ImageStyle>(imageStylesList[0]);

  const [presentationOutline, setPresentationOutline] = useState<ISlide[]>([]);

  const templates = getTemplates();

  const handleToggleStyleImageDrawer = () => {
    setShowStyleImageDrawer((prev) => !prev);
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
  };

  const updateSlidesCount = (count: number) => {
    setSelectedSlidesCount(count);
  };

  useEffect(() => {
    setShowEndScreen(textAmount !== 'academic' && textAmount !== 'keynote');
  }, [textAmount]);

  useEffect(() => {
    if (loading && presentationOutline && presentationOutline?.length > 0) {
      setShowOutlineDrawer(true);
    }
  }, [loading, presentationOutline]);

  const updateImageSource = (val: string) => {
    let current = [...imageSource];

    if (current.includes(val)) {
      current = current.filter((c) => c !== val);
    } else {
      current.push(val);
    }

    setImageSource(current);
  };

  const addImportUrl = (url: string) => {
    if (!importUrl.includes(url)) setImportUrl([...importUrl, url]);
  };

  const removeImportUrl = (url: string) => {
    setImportUrl(importUrl.filter((u) => u !== url));
  };

  const addOutlineInstructions = (instructions: string[]) => {
    setOutlineInstructions(instructions);
  };

  const addPromptContext = (context: string) => {
    if (!promptContext.includes(context)) setPromptContext([...promptContext, context]);
  };

  const removePromptContext = (context: string) => {
    setPromptContext(promptContext.filter((u) => u !== context));
  };

  const addImportSlide = (doc: DocData) => {
    if (!importSlides.find((d) => d.title === doc.title)) setImportSlides([...importSlides, doc]);
  };

  const addImportDocument = (doc: DocData) => {
    if (!importDocument.find((d) => d.title === doc.title))
      setImportDocument([...importDocument, doc]);
  };

  const addImportSheet = (doc: DocData) => {
    if (!importSheet.find((d) => d.title === doc.title)) setImportSheet([...importSheet, doc]);
  };

  const removeImportedDoc = (doc: string) => {
    setImportDocument(importDocument.filter((u) => u.title !== doc));
  };

  const removeImportedSlides = (doc: string) => {
    setImportSlides(importSlides.filter((u) => u.title !== doc));
  };

  const removeImportedSheet = (doc: string) => {
    setImportSheet(importSheet.filter((u) => u.title !== doc));
  };

  const handleGenerateOutline = async () => {
    setShowMiddleware(true);
    //setloading(true);

    const documentsData = importDocument.map((d) => d.content).join(';');
    const slidesData = importSlides.map((d) => d.content).join(';');
    const sheetsData = importSheet.map((d) => d.content).join(';');

    let slides = [] as ISlide[];

    if (type === 'youtube') {
      const response = await presentationService.generateYoutubePresentationOutline(
        prompt,
        language,
        textAmount,
        promptContext,
        importUrl,
        documentsData,
        slidesData,
        sheetsData,
        selectedSlidesCount,
      );
      if (!response) {
        onShowInfo({
          headerKey: 'youtube_error_header',
          bodyKey: 'youtube_error_body',
          titleKey: 'youtube_error_title',
        });
        setShowMiddleware(false);
        return;
      }
      slides = response.slides;
      setPrompt(response.prompt);
    } else if (type === 'speaker') {
      slides = await presentationService.generatePresentationOutlineForTheSpeaker(
        prompt,
        language,
        textAmount,
        promptContext,
        importUrl,
        documentsData,
        slidesData,
        sheetsData,
        selectedSlidesCount,
      );
    } else {
      const { result, description } = await presentationService.generatePresentationOutline(
        prompt,
        language,
        textAmount,
        promptContext,
        outlineInstructions,
        importUrl,
        documentsData,
        slidesData,
        sheetsData,
        selectedSlidesCount,
        keepCopy,
      );
      slides = result;
      setDescription(description);
    }
    setPresentationOutline(slides);
  };

  const handleChangeSelectedImageStyle = (imageStyle: ImageStyle) => {
    setSelectedImageStyle(imageStyle);
  };

  const handleStartWithTemplate = () => {
    setShowMiddleware(false);
    setShowStyleImageDrawer(false);

    if (presentationOutline && presentationOutline.length > 0) {
      setShowOutlineDrawer(!showOutlineDrawer);
    } else {
      setloading(true);
    }
  };

  const updateSlidesOrder = (newSlides: ISlide[]) => {
    if (presentationOutline) setPresentationOutline(newSlides);
  };

  const handleGenerate = async () => {
    const documentsData = importDocument.map((d) => d.content).join(';');
    const slidesData = importSlides.map((d) => d.content).join(';');
    const sheetsData = importSheet.map((d) => d.content).join(';');

    const response = await presentationService.generatePresentationFromOutline(
      presentationOutline,
      workspace,
      description,
      language,
      textAmount,
      template,
      theme,
      font,
      title,
      authorName,
      showPages,
      showWatermark,
      showEndScreen,
      selectedImageStyle.slug,
      importUrl,
      promptContext,
      documentsData,
      slidesData,
      sheetsData,
      type === 'speaker',
    );

    if (response) {
      analyticsService.trackPresentationCreation(response.id);
      localStorage.removeItem('outline');
      presentationService.getSlides(response.id, outlineInstructions, keepCopy);
      navigate(`/presentation/${response.alias}`);
    }
  };

  return {
    prompt,
    loading,
    handleGenerateOutline,
    setPrompt,
    setShowContextModal,
    showContextModal,
    showCreateConfirmation,
    setShowCreateConfirmation,
    setPresentationOutline,
    setShowOutlineDrawer,
    promptContext,
    addPromptContext,
    removePromptContext,
    addOutlineInstructions,
    outlineInstructions,
    keepCopy,
    setkeepCopy,
    showOutlineDrawer,
    presentationOutline,
    handleGenerate,
    language,
    handleLanguageChange,
    textAmount,
    setTextAmount,
    imageSource,
    updateImageSource,
    showUrlModal,
    setShowUrlModal,
    importUrl,
    addImportUrl,
    removeImportUrl,
    importDocument,
    importSlides,
    addImportDocument,
    addImportSlide,
    importSheet,
    addImportSheet,
    documentLoading,
    setDocumentLoading,
    removeImportedDoc,
    removeImportedSlides,
    removeImportedSheet,
    showUploadModal,
    setShowUploadModal,
    updateSlidesOrder,
    updateSlidesCount,
    selectedSlidesCount,
    theme,
    setTheme,
    font,
    setFont,
    template,
    setTemplate,
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
    setWorkspace,
    workspace,
    showStyleImageDrawer,
    handleToggleStyleImageDrawer,
    selectedImageStyle,
    handleChangeSelectedImageStyle,
  };
};

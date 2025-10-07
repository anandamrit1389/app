import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import {
  convertDomIntoModel,
  convertModelToPdf,
  convertModelToPdfForPrint,
  convertModelToPptx,
  convertModelToVideo,
} from '../helpers/utils/convertion';
import {
  IPresentation,
  ISlide,
  IContent,
  HiddenSlideImprovement,
  IAddSlideOptions,
} from '../interfaces/ISlides';
import { newSlideVariations } from '@/helpers/constants/slide-variations.const';
import presentationService from '@/api/presentationService';
import {
  CurrentAudio,
  FontSizeMap,
  IActiveElement,
  ITransformImage,
  IUsePresentation,
  IVoice,
} from '@/interfaces/IUsePresentation';
import { usePresentationHistory } from './usePresentationHistory';
import { useFontFamily } from './useFontFamily';
import {
  defaultThemes,
  themeCatalog,
  themeSwitchMap,
  transitionOptions,
} from '@/helpers/constants/themes.const';
import { useWebSocket } from './useWebSocket';
import useExportGoogleSlide from './useExportGoogleSlide';
import { AuthContext } from '@/providers/auth.provider';
import { getAudioNameFromUrl } from '@/helpers/utils/parsers';
import ElevenLabsService from '@/api/elevenLabsService';
import { remapAgenda, updateTitleByAgenda } from '@/helpers/utils/agenda';
import { reorderSlides } from '@/helpers/utils/slides';
import { ImagePurpose, PresentationAccess, SlideTransition } from '@/interfaces/IPresentation';
import { FontScheme } from '@/interfaces/font.interface';
import { applyExtraFonts } from '@/helpers/utils/fonst';
import { applyThemes } from '@/helpers/utils/themes';
import { presentationFonts } from '@/helpers/constants/fonts.const';
import { ThemeSchema } from '@/interfaces/theme.interface';
import useAnimatedText from './useAnimatedText';
import { useTranslation } from 'react-i18next';
import SlideService from '@/api/slideService';
import PresentationService from '@/api/presentationService';
import useToastForExport from './useToastForExport';
import { ImageResponse } from '@/interfaces/images-gallery.interface';
import { getTemplate } from '@/helpers/constants/presentation-templates.const';
import { analyticsService } from '@/helpers/services/AnalyticsService';
import { updateTranslatableField } from '@/helpers/utils/updateTranslatabeField';
import VideoExportService from '@/api/videoExportService';
import OpenAIService from '@/api/openAiService';

export const usePresentation = (): IUsePresentation => {
  const { user } = useContext(AuthContext);
  const { upload } = useExportGoogleSlide();
  const { socket } = useWebSocket();
  const { setPresentationHistory, handleUndo, handleRedo, index, history } =
    usePresentationHistory();
  const { fontFamily, setFontFamily } = useFontFamily('inter');
  const { callToast } = useToastForExport();

  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });

  const [slideTransition, setSlideTransition] = useState<SlideTransition>(SlideTransition.NONE);
  const [presentation, setPresentation] = useState<IPresentation | null>(null);
  const [lastGenerated, setLastGenerated] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [originLanguage, setOriginLanguage] = useState('english');
  const [exportingPDF, setExportingPDF] = useState(false);
  const [exportingPDFForPrint, setExportingPDFForPrint] = useState(false);
  const [exportingPPTX, setExportingPPTX] = useState(false);
  const [exportingSlides, setExportingSlides] = useState(false);
  const [exportingVideo, setExportingVideo] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPages, setShowPages] = useState(true);
  const [showWatermark, setShowWatermark] = useState(true);
  const [showTitle, setShowTitle] = useState(true);
  const [showAgenda, setShowAgenda] = useState(false);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentSideBarType, setCurrentSideBarType] = useState('theme');
  const [isSideBarActive, setIsSideBarActive] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [isVoicesLoading, setIsVoicesLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState<ISlide | undefined>(presentation?.slides?.[0]);
  const [currentAudio, setCurrentAudio] = useState<CurrentAudio | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [tempUrl, setTempUrl] = useState('');
  const [activeImage, setActiveImage] = useState<IActiveElement | null>(null);
  const [referenceImage, setReferenceImage] = useState<ITransformImage | null>(null);
  const [readonly, setReadonly] = useState(false);
  const [voices, setVoices] = useState<IVoice[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const slidesRef = useRef<HTMLDivElement[]>([]);
  const [isDesktopMode, setIsDesktopMode] = useState(true);
  const [extraFonts, setExtraFonts] = useState<FontScheme[]>([]);
  const [extraThemes, setExtraThemes] = useState<ThemeSchema[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  const [slideLoading, setSlideLoading] = useState<string>('');
  const [loadingImageContentId, setLoadingImageContentId] = useState<string | null>(null);
  const [loadingImageSlideId, setLoadingImageSlideId] = useState<string | null>(null);
  const [selectedText, setSelectedText] = useState('');
  const [fontSizes, setFontSizes] = useState<FontSizeMap>({});
  const [transformOpen, setTransformOpen] = useState<boolean>(false);

  const theme = presentation?.themeId ?? 'light';
  const template = presentation?.template ?? 'light';
  const presentationTemplateInfo = getTemplate(template);

  const isExporting =
    exportingPDF || exportingPDFForPrint || exportingPPTX || exportingSlides || exportingVideo;

  const setPresentationAndHistory = useCallback(
    (presentation: IPresentation, skipHistory?: boolean) => {
      setPresentation(presentation);

      if (!skipHistory) {
        setPresentationHistory(presentation);
      }
    },
    [setPresentationHistory],
  );

  const getPresentationHiddenImprovements = () => {
    if (!presentation) return [];
    let hiddenImprovements: HiddenSlideImprovement[] = [];

    for (let i = 0; i < presentation.slides.length; i++) {
      const presentationHiddenImprovements = presentation.slides[i].hiddenSlideImprovements;
      if (presentationHiddenImprovements && presentationHiddenImprovements.length > 0) {
        const presentationHiddenImprovementsWithSlideId = presentationHiddenImprovements.map(
          (improvement) => ({
            ...improvement,
            slideId: presentation.slides[i].id,
          }),
        );
        hiddenImprovements = [...hiddenImprovements, ...presentationHiddenImprovementsWithSlideId];
      }
    }
    return hiddenImprovements;
  };

  const handleUpdateCurrentAudio = (audio: CurrentAudio | null) => {
    setCurrentAudio(audio);
  };

  const toggleTheme = (theme: string) => {
    if (presentation && theme !== presentation?.themeId) {
      if (theme === 'personal' && user?.themeColors) {
        const userInfo = localStorage.getItem('user_info');
        const userInfoParsed = userInfo ? JSON.parse(userInfo) : null;
        themeCatalog.personal.colors = {
          ...userInfoParsed?.user?.themeColors,
        };

        applyThemes([themeCatalog.personal], userInfoParsed?.user?.themeColors);
      }

      for (let i = 0; i < presentation.slides.length; i++) {
        if (presentation.slides[i].themeId) {
          presentation.slides[i].themeId = themeSwitchMap[theme] || null;
        }
      }

      setPresentationAndHistory({ ...presentation, themeId: theme });
    }
  };

  const toggleTemplate = (template: string) => {
    const newTemplate = getTemplate(template);

    if (newTemplate) {
      toggleTheme(newTemplate.themeId);
      setFontFamily(newTemplate.fontFamily);
    }

    if (presentation) {
      setPresentationAndHistory({
        ...presentation,
        template: template,
        fontFamily: fontFamily,
        themeId: newTemplate?.themeId || theme,
      });
    }
  };

  useEffect(() => {
    if (!presentation) return;

    const fontSizesMap: FontSizeMap = {};
    presentation.slides.forEach((slide) => {
      if (slide.slideType !== 'free-slide') return;

      const existingFontSize = fontSizes[slide.id]?.text;
      const textContent = slide.content.find((c) => c.contentType === 'text');
      const pos = textContent?.position ? JSON.parse(textContent.position) : {};

      fontSizesMap[slide.id] = {
        title: existingFontSize ?? pos.fontSizeTitle ?? 0.8,
        subtitle: existingFontSize ?? pos.fontSizeSubtitle ?? 0.8,
        text: existingFontSize ?? pos.fontSizeText ?? 0.8,
      };
    });

    setFontSizes({
      ...fontSizes,
      ...fontSizesMap,
    });
  }, [presentation?.slides.length]);

  useEffect(() => {
    if (presentation && fontFamily !== presentation.fontFamily)
      setPresentation({ ...presentation, fontFamily: fontFamily });

    if (presentation?.themeId === 'personal' && user?.themeColors) {
      applyThemes([themeCatalog.personal], user.themeColors);
    }
  }, [fontFamily, presentation, user?.themeColors]);

  useEffect(() => {
    if (presentation && slideTransition !== presentation.slideTransition)
      setPresentation({ ...presentation, slideTransition: slideTransition });
  }, [slideTransition, presentation]);

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        setIsVoicesLoading(true);
        const { data: voices } = await ElevenLabsService.getVoices();
        setVoices(voices);
      } catch (err) {
        console.error(err);
      } finally {
        setIsVoicesLoading(false);
      }
    };

    if (user?.subscription?.ownedSubscription?.status === 'active') {
      fetchVoices();
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (presentation && presentation.generationFinished && !readonly) {
        const slides = presentation.slides.map((slide) => ({
          ...slide,
          audio: slide.audio ? getAudioNameFromUrl(slide.audio) : slide.audio,
        }));
        presentationService.updatePresentation({ ...presentation, slides });
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [presentation, readonly]);

  const getPresentation = useCallback(
    async (id: string) => {
      if (!id) return;

      const data = await presentationService.getPresentation(id);

      if (data) {
        setFontFamily(data?.fontFamily);
        setTempUrl(data?.logotype ?? '');
        setSlideTransition(data?.slideTransition);
        setActiveSlide(data?.slides?.[0]);
        setShowAgenda(data?.showAgenda ?? false);
        setShowPages(data?.showPages ?? false);
        setShowWatermark(data?.showWatermark ?? true);
        setShowTitle(data?.showTitle ?? false);
        setShowEndScreen(data?.showEndScreen ?? false);
        setPresentationAndHistory(data);
        setIsDesktopMode(!data.speachMode);
        setOriginLanguage(data.language ?? 'english');

        setExtraFonts(data.extraFonts);
        applyExtraFonts(data.extraFonts);

        setExtraThemes(data.extraThemes);
        applyThemes(data.extraThemes);

        checkAndRegenerateImages(data);
        setReadonly(data.readonly);
      }
    },
    [setFontFamily, setPresentationAndHistory, user],
  );

  const checkAndRegenerateImages = async (presentation: IPresentation) => {
    try {
      const brokenSlides = presentation.slides.filter((slide) => slide.accentImageKey === 'broken');

      if (brokenSlides.length > 0) {
        const updatedSlidesResponse = await Promise.all(
          brokenSlides.map(async (slide) => {
            return await SlideService.regenerateSlideImage(slide.id);
          }),
        );

        updatedSlidesResponse.forEach((response) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { presentation: _, ...slide } = response.data;

          setPresentation((prev) => {
            const upd: IPresentation = {
              ...prev,
              slides: prev?.slides?.map((s) => (s.id === slide.id ? slide : s)),
            } as IPresentation;
            setPresentationHistory(upd);

            return upd;
          });
        });
      }
    } catch (error) {
      console.error('Error during image regeneration:', error);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const splittedName = file.name.split('.');
      const fileExt = splittedName?.[splittedName?.length - 1];
      const mime = file.type;
      const allowedTypes = ['image/png', 'image/jpeg', 'image/webp']

      if (allowedTypes.includes(mime)) {
        const data = await presentationService.getImageUploadUrl(
          fileExt,
          mime,
          ImagePurpose.CUSTOM_LOGO,
        );
        const uploadRes = await presentationService.uploadImage(data.putUrl, file);

        if (data && uploadRes) {
          setTempUrl(data.imageUrl);

          if (presentation)
            setPresentation({
              ...presentation,
              logotype: data.imageUrl,
              logotypeKey: data.imageKey,
            });

          toast(t('newLogo'));
        }
      } else {
        toast.error(t('unsupportedType'))
      }
    }
  };

  const handleShowMeSelectedText = (slideId: string, textToImprove: string) => {
    changeActiveSlide(slideId);
    setSelectedText(textToImprove);
  };

  const onHideSelectedText = () => {
    setSelectedText('');
  };

  const handleToggleDevice = () => {
    setIsDesktopMode((prev) => !prev);
  };

  const removeLogo = () => {
    setFile(null);
    setTempUrl('');
    setPresentation((prev) => {
      const upd: IPresentation = {
        ...prev,
        logotype: '',
        logotypeKey: '',
      } as IPresentation;
      setPresentationHistory(upd);

      return upd;
    });
  };

  const handleUpdateSlide = (slide: ISlide) => {
    if (!presentation?.generationFinished) return;

    if (presentation) {
      setPresentation((prev) => {
        const upd: IPresentation = {
          ...prev,
          slides: prev?.slides?.map((s) => (s.id === slide.id ? slide : s)),
        } as IPresentation;
        setPresentationHistory(upd);

        return upd;
      });
    }
  };

  const updateSlidesOrder = (newSlides: ISlide[]) => {
    if (presentation) {
      newSlides = remapAgenda(newSlides, newSlides.length >= 20);
      setPresentationAndHistory({ ...presentation, slides: newSlides });
    }
  };

  const addSlide = async (slideOptions: IAddSlideOptions) => {
    try {
      const type = slideOptions.type;
      setLoading(true);
      const variant =
        type !== 'ask-ai' ? (newSlideVariations[type]?.[0]?.name ?? 'default') : 'ask-ai';

      if (presentation) {
        let data;
        if (slideOptions.prompt && type !== 'free-slide') {
          data = await presentationService.addNewSlide(
            slideOptions.prompt,
            type,
            variant,
            presentation.id,
            presentation.imageStyle,
            slideOptions.importedChartData,
          );
        } else if (type === 'free-slide') {
          const newSlide: ISlide = {
            id: uuidv4(),
            title: slideOptions.title || '',
            slideNumber:
              (slideOptions.index && slideOptions.index + 1) ||
              (activeSlide && activeSlide?.slideNumber + 1) ||
              0,
            slideType: 'free-slide',
            variation: 'full',
            content: [],
            titleTranslations: {},
            subtitleTranslations: {},
          };

          data = {
            ...presentation,
            slides: [...presentation.slides, newSlide],
          };
        }

        if (data) {
          let updatedSlides = reorderSlides(
            data.slides,
            slideOptions.index ?? activeSlide?.slideNumber,
          );
          updatedSlides = remapAgenda(updatedSlides, data.slides.length >= 20);

          const newSlideIndex = slideOptions.index ?? activeSlide?.slideNumber ?? 0;

          const updatedPresentation = {
            ...presentation,
            slides: updatedSlides,
          };

          updatedSlides[newSlideIndex].slideType !== 'closing-slide'
            ? setActiveSlide(updatedSlides[newSlideIndex])
            : setActiveSlide(updatedSlides[newSlideIndex - 1]);

          setPresentationAndHistory(updatedPresentation);
        }
      }
    } catch (error) {
      console.error('Error during slide addition:', error);
    } finally {
      setLoading(false);
    }
  };

  const changeActiveSlide = (slide: string | ISlide) => {
    if (slide === activeSlide?.id || (slide as ISlide)?.id === activeSlide?.id) return;

    if (typeof slide === 'string') {
      const newSlide = presentation?.slides?.find((s) => s.id === slide);
      setActiveSlide(newSlide);
    }

    if (typeof slide === 'object') {
      setActiveSlide(slide);
    }

    if (isSideBarActive && currentSideBarType === 'webimages') {
      hideSideBar();
    }
  };

  const deleteItem = (id: string) => {
    if (presentation) {
      const slides = presentation.slides.map((slide) => ({
        ...slide,
        content: slide.content?.filter((content) => content.id !== id),
      }));
      setPresentationAndHistory({ ...presentation, slides });
    }
  };

  const skipSlide = (id: string) => {
    if (presentation) {
      const pres = { ...presentation };
      const slides = presentation.slides.map((s) => {
        if (s.id === id) {
          if (s.slideType === 'content-slide') {
            return { ...s, skipSlide: !pres.showAgenda };
          }
          if (s.slideType === 'closing-slide') {
            return { ...s, skipSlide: !pres.showEndScreen };
          }
          return { ...s, skipSlide: !s.skipSlide };
        }

        return s;
      });

      const slide = slides.find((s) => s.id === id);

      if (slide && slide.slideType === 'content-slide') {
        setShowAgenda((val) => !val);
        pres.showAgenda = !pres.showAgenda;
      }

      if (slide && slide.slideType === 'closing-slide') {
        setShowEndScreen((val) => !val);
        pres.showEndScreen = !pres.showEndScreen;
      }
      setPresentationAndHistory({ ...pres, slides });
    }
  };

  const createContent = (contentType: string, variation?: string, width?: string) => {
    if (!activeSlide) return;

    let newContent;
    switch (contentType) {
      case 'text':
        newContent = {
          id: uuidv4(),
          contentType,
          sortOrder: (activeSlide.content?.length || 0) + 1,
          position: JSON.stringify({
            top: '40%',
            left: '40%',
            width: '30%',
            height: '10%',
            borderRadius: '12px',
            bgEnabled: true,
          }),
          titleTranslations: {},
          subtitleTranslations: {},
          textTranslations: {},
        };
        break;
      case 'shape':
        newContent = {
          id: uuidv4(),
          contentType,
          sortOrder: (activeSlide.content?.length || 0) + 1,
          position: JSON.stringify({
            top: '40%',
            left: '40%',
            width: width || '20%',
            height: '10%',
            borderRadius: '0px',
            bgEnabled: false,
          }),
          title: variation,
          titleTranslations: {},
          subtitleTranslations: {},
          textTranslations: {},
        };
        break;
      case 'image':
        newContent = {
          id: uuidv4(),
          contentType,
          sortOrder: (activeSlide.content?.length || 0) + 1,
          position: JSON.stringify({
            top: '30%',
            left: '40%',
            width: '20%',
            height: '40%',
            borderRadius: '12px',
            bgEnabled: true,
          }),
          titleTranslations: {},
          subtitleTranslations: {},
          textTranslations: {},
        };
        break;
      case 'card':
        newContent = {
          id: uuidv4(),
          contentType,
          sortOrder: (activeSlide.content?.length || 0) + 1,
          position: JSON.stringify({
            top: '30%',
            left: '40%',
            width: '20%',
            height: '40%',
            borderRadius: '12px',
            bgEnabled: true,
          }),
          titleTranslations: {},
          subtitleTranslations: {},
          textTranslations: {},
        };
        break;
    }

    if (!newContent) return;

    const updatedSlide = {
      ...activeSlide,
      content: [...(activeSlide.content || []), newContent],
    };

    updateSlide?.(updatedSlide);
    setActiveSlide(updatedSlide);
  };

  const deleteContent = (contentId: string) => {
    if (activeSlide) {
      const newContent = activeSlide.content.filter((c) => c.id !== contentId);
      const updatedSlide = { ...activeSlide, content: newContent };

      updateSlide?.(updatedSlide);
      setActiveSlide(updatedSlide);
    }
  };

  const deleteSlide = (id?: string) => {
    if (activeSlide) {
      const toDelete = id ?? activeSlide.id;

      setIdToDelete(toDelete);
      setShowDeleteConfirmation(true);
    }
  };

  const confirmDelete = () => {
    if (presentation && activeSlide && idToDelete) {
      const slideToDelete = presentation.slides?.find((s) => s.id === idToDelete);

      if (slideToDelete && slideToDelete.slideType === 'content-slide') {
        return changeShowAgenda();
      }

      if (slideToDelete && slideToDelete.slideType === 'closing-slide') {
        return changeShowEndScreen();
      }

      let slides = presentation.slides?.filter((s) => s.id !== idToDelete);
      slides = slides.map((slide, index) => ({
        ...slide,
        slideNumber: index + 1,
      }));
      setPresentationAndHistory({ ...presentation, slides });
      setActiveSlide(
        slides[
          activeSlide.slideNumber === 1 ? activeSlide.slideNumber : activeSlide.slideNumber - 1
        ],
      );

      if (slides.length >= 20 && slides[2].slideType === 'content-slide') {
        slides = slides
          .filter((_, index) => index !== 2)
          .map((slide, index) => {
            if (index > 1) {
              return {
                ...slide,
                slideNumber: index + 1,
              };
            }

            return slide;
          });
      }

      const newSlides = remapAgenda(slides, slides.length >= 20);

      setPresentationAndHistory({ ...presentation, slides: newSlides });
    }

    setIdToDelete(null);
    // setShowDeleteConfirmation(false);
  };

  const moveItem = (id: string, moveUp?: boolean) => {
    if (presentation) {
      let slides = presentation.slides;
      const neededSlide = slides.find((s) => s.content.some((c) => c.id === id));
      const movableContentIndex = neededSlide?.content.findIndex((c) => c.id === id);

      if (neededSlide && movableContentIndex !== undefined && movableContentIndex >= 0) {
        if (moveUp) {
          neededSlide.content[movableContentIndex].sortOrder++;
          neededSlide.content[movableContentIndex + 1].sortOrder--;
        } else {
          neededSlide.content[movableContentIndex].sortOrder--;
          neededSlide.content[movableContentIndex - 1].sortOrder++;
        }
      }

      if (neededSlide) {
        neededSlide.content.sort((a, b) => a.sortOrder - b.sortOrder);
      }

      slides = slides.map((item) => (item.id === neededSlide?.id ? neededSlide : item));

      //update slide order according to the order on agenda
      if (
        neededSlide?.slideType === 'content-slide' &&
        movableContentIndex !== undefined &&
        movableContentIndex >= 0
      ) {
        const updatedSlides = [...slides];

        if (moveUp) {
          updatedSlides[movableContentIndex + 2].slideNumber++;
          updatedSlides[movableContentIndex + 3].slideNumber--;
        } else {
          updatedSlides[movableContentIndex + 2].slideNumber--;
          updatedSlides[movableContentIndex + 1].slideNumber++;
        }

        updatedSlides.sort((a, b) => a.slideNumber - b.slideNumber);
        slides = updatedSlides;
      }

      setPresentationAndHistory({ ...presentation, slides });
    }
  };

  const splitContentAsImportant = (id: string) => {
    if (presentation) {
      let slides = [...presentation.slides];
      let itemToSplit: IContent | null = null;
      let slideIndex = 0;

      slides.forEach((slide, index) => {
        const content = slide.content?.find((content) => content.id === id);
        if (content) {
          itemToSplit = content;
          slideIndex = index;
        }
      });

      slides = slides.map((slide) => ({
        ...slide,
        content: slide.content?.filter((content) => content.id !== id),
      }));

      if (itemToSplit) {
        const newSlide: ISlide = {
          id: uuidv4(),
          slideNumber: slideIndex + 1,
          slideType: 'image-caption-slide',
          variation: 'full',
          title: '',
          content: [itemToSplit],
          titleTranslations: {},
          subtitleTranslations: {},
        };
        slides.splice(newSlide.slideNumber, 0, newSlide);
      }

      slides = slides.map((slide, index) => ({
        ...slide,
        slideNumber: index + 1,
      }));

      setPresentationAndHistory({ ...presentation, slides });

      toast('Selected content moved to separate slide', {
        action: {
          label: 'Undo',
          onClick: () => {
            handleUndoAction();
          },
        },
      });
    }
  };

  const updateSlide = useCallback(
    (updSlide: ISlide, field?: keyof ISlide) => {
      if (!presentation?.generationFinished) return;

      if (presentation) {
        setPresentation((prev) => {
          const slideKey = field ? field : 'id';

          let slides = prev?.slides.map((s) => {
            return s[slideKey] === updSlide[slideKey] ? updSlide : s;
          });

          if (slides && presentation.generationFinished) {
            if (updSlide.slideType === 'content-slide') {
              slides = updateTitleByAgenda(slides, updSlide);
            } else {
              slides = remapAgenda(slides, slides.length >= 20);
            }
          }

          const upd: IPresentation = { ...prev, slides } as IPresentation;

          setPresentationHistory(upd);
          setPresentation(upd);

          return upd;
        });
      }
    },
    [presentation],
  );

  const updateContent = (content: IContent, slideId: string) => {
    if (presentation) {
      setPresentation((prev) => {
        const upd: IPresentation = {
          ...prev,
          slides: prev?.slides?.map((s) =>
            slideId === s.id
              ? {
                  ...s,
                  content: s.content.map((c) => (c.id === content?.id ? content : c)),
                }
              : s,
          ),
        } as IPresentation;

        setPresentationHistory(upd);

        return upd;
      });
    }
  };

  const handleMoveLayout = (slide: ISlide, direction: 'prev' | 'next') => {
    if (!slide || !slideAlternatives || slideAlternatives.length === 0) return;

    const currentIndex = slideAlternatives.findIndex((variant) => variant.name === slide.variation);

    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % slideAlternatives.length;
    } else {
      newIndex = currentIndex - 1;
      if (newIndex < 0) newIndex = slideAlternatives.length - 1;
    }

    changeSlideVariant(slideAlternatives[newIndex].name);
  };

  const changeSlideVariant = (variant: string) => {
    if (presentation) {
      const slides = presentation.slides.map((s) =>
        s.id === activeSlide?.id ? { ...s, variation: variant } : s,
      );

      setActiveSlide((prev) => {
        return { ...prev, variation: variant } as ISlide;
      });

      setPresentationAndHistory({ ...presentation, slides }, true);
    }
  };

  const switchDimmedImage = (e: boolean) => {
    if (presentation) {
      const slides = presentation.slides.map((s) =>
        s.id === activeSlide?.id ? { ...s, dimmedImage: e } : s,
      );

      setActiveSlide((prev) => {
        return { ...prev, dimmedImage: e } as ISlide;
      });

      setPresentationAndHistory({ ...presentation, slides }, true);
    }
  };

  const slideAlternatives = useMemo(() => {
    const slide = presentation?.slides.find((s) => s.id === activeSlide?.id);

    if (!slide) return [];

    if (slide.slideType === 'chart-slide' && slide.variation !== 'single-chart' && !slide.variation.includes('WithText')) {
      return [];
    } else {
      return newSlideVariations[slide.slideType];
    }
  }, [activeSlide, presentation?.slides]);

  const present = () => {
    openFullscreen();
  };

  const openFullscreen = () => {
    if (!isFullscreen) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const docEl: any = document.body;
      const requestFullScreen =
        docEl.requestFullscreen ||
        docEl.mozRequestFullScreen ||
        docEl.webkitRequestFullScreen ||
        docEl.msRequestFullscreen;

      if (requestFullScreen) {
        requestFullScreen.call(docEl);
      } else {
        setIsFullscreen(true);
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const doc: any = document;
      const cancelFullScreen =
        doc.exitFullscreen ||
        doc.mozCancelFullScreen ||
        doc.webkitExitFullscreen ||
        doc.msExitFullscreen;

      if (cancelFullScreen) {
        cancelFullScreen.call(doc);
      } else {
        setIsFullscreen(false);
      }
    }
  };

  const showSideBar = (sideBarType?: string) => {
    setCurrentSideBarType(sideBarType ?? 'theme');

    if (!isSideBarActive) {
      setIsSideBarActive(!isSideBarActive);
    } else if (
      !sideBarType ||
      (sideBarType === currentSideBarType && sideBarType !== 'webimages')
    ) {
      hideSideBar();
    }
  };

  const hideSideBar = () => {
    setIsSideBarActive(false);
    setActiveImage(null);
  };

  const updatePresentationTitle = (value: string) => {
    if (presentation) {
      const updPresentation = updateTranslatableField(
        presentation,
        'title',
        value,
        selectedLanguage,
        originLanguage === selectedLanguage,
      );
      setPresentationAndHistory(updPresentation);
    }
  };

  const updatePresentationDescription = (value: string) => {
    if (presentation) {
      const updPresentation = updateTranslatableField(
        presentation,
        'description',
        value,
        selectedLanguage,
        originLanguage === selectedLanguage,
      );
      setPresentationAndHistory(updPresentation);
    }
  };

  const updateAccessLevel = (value: PresentationAccess) => {
    if (presentation) {
      setPresentationAndHistory({ ...presentation, accessType: value });
    }
  };

  const updateAccessPassword = (value: string) => {
    if (presentation) {
      setPresentationAndHistory({ ...presentation, accessPassword: value });
    }
  };

  const updatePresentationVoice = (voiceId: string) => {
    if (presentation) {
      const slides = presentation.slides.map((s) => {
        return {
          ...s,
          audio: null,
        };
      });
      setPresentationAndHistory({ ...presentation, voiceId, slides });
    }
  };

  const updateAuthorName = (value: string) => {
    if (presentation) {
      setPresentationAndHistory({ ...presentation, authorName: value });
    }
  };

  const changeShowPages = () => {
    setShowPages((prev) => !prev);

    if (presentation) {
      setPresentationAndHistory({ ...presentation, showPages: !showPages }, true);
    }
  };

  const changeShowWatermark = () => {
    if (user?.subscription?.ownedSubscription?.status === 'active') {
      setShowWatermark((prev) => !prev);

      if (presentation) {
        setPresentationAndHistory({ ...presentation, showWatermark: !showWatermark }, true);
      }
    }
  };

  const changeShowTitle = () => {
    setShowTitle((prev) => !prev);

    if (presentation) {
      setPresentationAndHistory({ ...presentation, showTitle: !showTitle }, true);
    }
  };

  const changeShowAgenda = () => {
    setShowAgenda((prev) => !prev);
    if (presentation) {
      setPresentationAndHistory({ ...presentation, showAgenda: !showAgenda }, true);
    }
  };

  const changeShowEndScreen = () => {
    setShowEndScreen((prev) => !prev);

    if (presentation) {
      setPresentationAndHistory(
        {
          ...presentation,
          showEndScreen: !showEndScreen,
        },
        true,
      );
    }
  };
  const onExport = async (type: string) => {
    const container = containerRef.current;

    if (!container) {
      toast.error('Container not found');
      return;
    }

    const model = await convertDomIntoModel(container);
    const isPro = user?.subscription?.ownedSubscription?.status === 'active';
    const language = selectedLanguage ? selectedLanguage : presentation?.language;

    try {
      if (type === 'pptx') {
        setExportingPPTX(true);
        const pptx = await convertModelToPptx(
          model,
          presentation?.authorName ?? '',
          fontFamily,
          presentation?.titleTranslations?.[selectedLanguage] ?? presentation?.title ?? 'pres',
          presentation?.slides,
          showAgenda,
          isPro,
        );
        setExportingPPTX(false);
        toast.success(pptx);
      } else if (type === 'pdf') {
        setExportingPDF(true);
        const pdf = await convertModelToPdf(
          presentation?.titleTranslations?.[selectedLanguage] ?? presentation?.title ?? '',
          container,
          isPro,
          language
        );
        setExportingPDF(false);
        toast.success(pdf);
      } else if (type === 'print') {
        setExportingPDFForPrint(true);
        const pdfBase64 = await convertModelToPdfForPrint(container, isPro, language);
        const byteCharacters = atob(pdfBase64.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        setExportingPDFForPrint(false);
        callToast(url, 'pdfForPrint');
      } else if (type === 'video' || type.startsWith('video-')) {
        const withVoiceOver = type === 'video-voice';

        setExportingVideo(true);

        try {
          if (!presentation) {
            throw new Error('Presentation not found');
          }
          const video = await convertModelToVideo(container, isPro, withVoiceOver, presentation, language);
          setExportingVideo(false);
          toast.success(video);

          if (withVoiceOver && presentation?.id) {
            try {
              await VideoExportService.reportVideoExportSuccess(presentation.id);
            } catch (error) {
              console.error('Failed to report video export to backend:', error);
            }
          }
        } catch (error) {
          setExportingVideo(false);
          toast.error('Video conversion failed :(');
          throw error;
        }
      } else {
        setExportingSlides(true);
        const slidesRes = await upload(
          presentation?.titleTranslations?.[selectedLanguage] ?? presentation?.title ?? '',
          model,
          presentation as IPresentation,
          isPro,
        );

        if (slidesRes?.message?.includes('completed')) {
          setExportingSlides(false);
          const docsUrl = `https://docs.google.com/presentation/d/${slidesRes?.id}`;
          callToast(docsUrl, 'googleSlides');

          if (slidesRes?.id) {
            window.open(docsUrl, '_blank', 'noopener,noreferrer');
          }
        } else {
          setExportingSlides(false);
          toast.error('Presentation conversion failed :(');
        }
      }
    } catch (error) {
      toast.error('Presentation conversion failed :(');
      setExportingPDF(false);
      setExportingPDFForPrint(false);
      setExportingPPTX(false);
      setExportingSlides(false);
    }
  };

  const handleUndoAction = useCallback(() => {
    const newState = handleUndo();
    setPresentationAndHistory(newState, true);
  }, [handleUndo, setPresentationAndHistory]);

  const handleRedoAction = useCallback(() => {
    const newState = handleRedo();
    setPresentationAndHistory(newState, true);
  }, [handleRedo, setPresentationAndHistory]);

  const cloneSlide = useCallback(
    (id: string) => {
      if (presentation) {
        let slides = [...presentation.slides];
        const slideIndex = slides.findIndex((slide) => slide.id === id);

        if (slideIndex >= 0) {
          const slideToClone = slides[slideIndex];
          const newSlide: ISlide = {
            ...slideToClone,
            id: uuidv4(),
            slideNumber: slideIndex + 1,
            content: slideToClone.content?.map((c) => ({
              ...c,
              id: uuidv4(),
            })),
          };
          slides.splice(newSlide.slideNumber, 0, newSlide);
        }

        slides = slides.map((slide, index) => ({
          ...slide,
          slideNumber: index + 1,
        }));
        setPresentationAndHistory({ ...presentation, slides });

        toast('Slide was cloned', {
          action: {
            label: 'Undo',
            onClick: () => {
              handleUndoAction();
            },
          },
        });
      }
    },
    [handleUndoAction, presentation, setPresentationAndHistory],
  );

  const splitSlideByBullets = useCallback(
    (id: string, maxPerSlide: number) => {
      if (presentation) {
        let slides = [...presentation.slides];
        const slideIndex = slides.findIndex((slide) => slide.id === id);

        if (slideIndex >= 0) {
          const slideToClone = slides[slideIndex];
          const half = Math.ceil(slideToClone.content.length / 2);
          const firstSlideCount = Math.min(half, maxPerSlide);

          const newSlide: ISlide = {
            ...slideToClone,
            id: uuidv4(),
            slideNumber: slideIndex + 1,
            content: slideToClone.content?.slice(firstSlideCount).map((c) => ({
              ...c,
              id: uuidv4(),
            })),
          };
          slideToClone.content = slideToClone.content?.slice(0, firstSlideCount);
          slides.splice(newSlide.slideNumber, 0, newSlide);
        }

        slides = slides.map((slide, index) => ({
          ...slide,
          slideNumber: index + 1,
        }));
        setPresentationAndHistory({ ...presentation, slides });

        toast('Slide was splited', {
          action: {
            label: 'Undo',
            onClick: () => {
              handleUndoAction();
            },
          },
        });
      }
    },
    [handleUndoAction, presentation, setPresentationAndHistory],
  );

  const changeImageFromStock = (
    src: string,
    key?: string,
    imageUrlGeneratedAt?: Date,
    imageSlideId?: string,
    imageContentId?: string,
  ) => {
    const slideId = activeImage?.slideId ?? imageSlideId;
    const contentId = activeImage?.contentId ?? imageContentId;

    if (slideId && presentation) {
      const slides = [...presentation.slides];
      const newSlides = slides.map((s) => {
        if (slideId === s.id) {
          return {
            ...s,
            accentImage: !contentId ? src : s.accentImage,
            accentImageGeneratedAt: imageUrlGeneratedAt ? imageUrlGeneratedAt : null,
            accentImageKey: !contentId ? (key ? key : null) : s.accentImageKey,
            content: !contentId
              ? s.content
              : s.content.map((c) => {
                  if (c.id === contentId) {
                    return {
                      ...c,
                      image: src,
                      imageKey: key ? key : null,
                      imageGeneratedAt: imageUrlGeneratedAt ? imageUrlGeneratedAt : null,
                    };
                  } else {
                    return c;
                  }
                }),
          };
        } else {
          return s;
        }
      });

      if (activeSlide) {
        const updSlide: ISlide = newSlides.find((s) => s.id === slideId) ?? activeSlide;
        setActiveSlide(updSlide);
      }
      setPresentationAndHistory({ ...presentation, slides: newSlides });
    }
  };

  const filterSlides = useCallback(
    (slides: ISlide[] | undefined) => {
      if (!slides) return [];

      return slides.filter((slide) => {
        if (!showAgenda && slide.slideType === 'content-slide') return false;
        if (!showEndScreen && slide.slideType === 'closing-slide') return false;
        return true;
      });
    },
    [showAgenda, showEndScreen],
  );

  const filterSkippedSlides = useCallback(
    (slides: ISlide[] | undefined) => {
      if (!slides) return [];

      return slides.filter((slide) => {
        if (slide.skipSlide) return false;
        if (!showAgenda && slide.slideType === 'content-slide') return false;
        if (!showEndScreen && slide.slideType === 'closing-slide') return false;

        return true;
      });
    },
    [showAgenda, showEndScreen],
  );

  const updateLastGenerated = (slideNumber: number) => {
    setLastGenerated(slideNumber);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen((val) => !val);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.code === 'KeyZ') {
        handleRedoAction();
      } else if ((event.ctrlKey || event.metaKey) && event.code === 'KeyZ') {
        handleUndoAction();
      } else if ((event.ctrlKey || event.metaKey) && event.code === 'KeyD') {
        event.preventDefault();
        if (activeSlide) {
          cloneSlide(activeSlide?.id);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    activeSlide,
    cloneSlide,
    handleUndo,
    handleRedo,
    setPresentationAndHistory,
    handleUndoAction,
    handleRedoAction,
  ]);

  useEffect(() => {
    if (socket) {
      socket.on('slide-generated', (message) => {
        if (message.presentationId !== presentation?.id) return;
        setPresentation((prev) => {
          if (!prev) return prev;

          const slideExists = prev.slides.some((s) => s.id === message.slide.id);

          let slides;
          if (slideExists && message.isDeleted) {
            slides = prev.slides.filter((s) => s.id !== message.slide.id);
          } else if (slideExists) {
            slides = prev.slides.map((s) => (s.id === message.slide.id ? message.slide : s));
          } else {
            slides = [...prev.slides];
            const insertIndex = Math.max(0, Math.min(message.slide.slideNumber - 1, slides.length));
            slides.splice(insertIndex, 0, message.slide);
          }

          const upd: IPresentation = { ...prev, slides };
          return upd;
        });

        if (!message.isDeleted) {
          setLastGenerated(message.slide.slideNumber);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('slide-generated');
      }
    };
  }, [socket, updateSlide]);

  const {
    currentElement,
    switchToNextElement,
    showFeedbackModal,
    closeFeedbackModal,
    presentationId: feedbackPresentationId,
  } = useAnimatedText(presentation, changeActiveSlide, getPresentation, readonly);

  const handleCopyPresentation = async (presentationId: string) => {
    try {
      setLoading(true);
      const response = await presentationService.copyPresentation(presentationId, selectedLanguage);
      analyticsService.trackPresentationCreation(response.id);
      setIsCopied(true);
      toast.success(t('copiedMessage'));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSlideImage = (slideImageData: Partial<ISlide>) => {
    if (!activeSlide) return;

    const updatedSlide: ISlide = {
      ...activeSlide,
      ...slideImageData,
    };
    updateSlide(updatedSlide);
    setLoadingImageSlideId(null);
  };

  const handleUpdateContentImage = (
    contentImageData: Partial<IContent>,
    slideId: string,
    contentId: string,
  ) => {
    if (!activeSlide) return;

    const currentContent = activeSlide.content.find((c) => c.id === contentId);
    if (!currentContent) return;

    const updatedContent: IContent = {
      ...currentContent,
      ...contentImageData,
    };

    updateContent(updatedContent, slideId);
    setLoadingImageContentId(null);
  };

  const updateImage = (data: ImageResponse, slideId: string, contentId?: string) => {
    if (contentId) {
      handleUpdateContentImage(
        {
          image: data.imageUrl,
          imageKey: data.imageKey,
          imageGeneratedAt: data.imageUrlGeneratedAt,
        },
        slideId,
        contentId,
      );
      return;
    }

    handleUpdateSlideImage({
      accentImage: data.imageUrl,
      accentImageKey: data.imageKey,
      accentImageGeneratedAt: data.imageUrlGeneratedAt,
    });

    if (activeSlide) {
      setActiveSlide({
        ...activeSlide,
        accentImage: data.imageUrl,
        accentImageKey: data.imageKey,
        accentImageGeneratedAt: data.imageUrlGeneratedAt,
      });
    }
  };

  const handleTransformImage = async (
    prompt: string,
    referenceImage: ITransformImage | null,
  ) => {
    if (!referenceImage) return;

    try {
      const response = await OpenAIService.imageTransform({
        prompt,
        imageUrl: referenceImage.imageUrl,
      });

      if (response.data) {
        setReferenceImage({...referenceImage, imageUrl: response.data.imageUrl});
        updateImage(
          {
            imageKey: response.data.imageKey,
            imageUrl: response.data.imageUrl,
            imageUrlGeneratedAt: new Date(),
          },
          referenceImage.slideId,
          referenceImage.contentId
        );
      } else {
        toast.error(t('transformError'))
      }
    } catch (error) {
      console.error('Error generating image:', error);
    } 
  };

  const generateImage = async (
    prompt: string,
    slideId: string,
    contentId?: string,
    style?: string,
  ) => {
    if (contentId) {
      setLoadingImageContentId(contentId);
    } else {
      setLoadingImageSlideId(slideId);
    }
    const data = await PresentationService.generateNewImage(prompt, style);
    updateImage(data, slideId, contentId);
  };

  const handleImageUpload = async (file: File, slideId: string, contentId?: string) => {
    const splittedName = file.name.split('.');
    const fileExt = splittedName?.[splittedName?.length - 1];
    const mime = file.type;
    const allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp','image/avif'];

    if (allowedTypes.includes(mime)) {
      const data = await PresentationService.getImageUploadUrl(
        fileExt,
        mime,
        ImagePurpose.PRESENTATION_IMAGE,
      );

      const uploadRes = await PresentationService.uploadImage(data.putUrl, file);

      if (uploadRes) {
        updateImage(
          {
            imageKey: data.imageKey,
            imageUrl: data.imageUrl,
            imageUrlGeneratedAt: new Date(),
          },
          slideId,
          contentId,
        );
      }
    } else {
      toast.error(t('unsupportedType'));
    }
  };

  const countAgendaSlides = useMemo(() => {
    if (!presentation || showAgenda) return 0;
    return presentation.slides.filter((s) => s.slideType === 'content-slide').length;
  }, [presentation, showAgenda]);

  return {
    presentation,
    updateSlide,
    addSlide,
    activeSlide,
    setActiveSlide,
    changeActiveSlide,
    onExport,
    deleteItem,
    containerRef,
    changeSlideVariant,
    moveItem,
    splitContentAsImportant,
    isSideBarActive,
    setIsSideBarActive,
    showSideBar,
    present,
    isFullscreen,
    showUploadModal,
    setShowUploadModal,
    currentSideBarType,
    updatePresentationTitle,
    updatePresentationDescription,
    showPages,
    changeShowPages,
    showWatermark,
    changeShowWatermark,
    file,
    tempUrl,
    handleFileChange,
    removeLogo,
    createContent,
    deleteContent,
    deleteSlide,
    slideAlternatives,
    getPresentation,
    loading,
    cloneSlide,
    fontFamily,
    setFontFamily,
    transitionOptions,
    slideTransition,
    setSlideTransition,
    themes: defaultThemes,
    extraThemes,
    presentationFonts: presentationFonts,
    extraFonts: extraFonts,
    showDeleteConfirmation,
    confirmDelete,
    setShowDeleteConfirmation,
    slidesRef,
    exportingPDF,
    exportingPDFForPrint,
    exportingPPTX,
    exportingSlides,
    updateSlidesOrder,
    updateAuthorName,
    skipSlide,
    setActiveImage,
    setReferenceImage,
    referenceImage,
    changeImageFromStock,
    activeImage,
    readonly,
    voices,
    updatePresentationVoice,
    handleUpdateSlide,
    handleToggleDevice,
    isDesktopMode,
    isVoicesLoading,
    handleUpdateCurrentAudio,
    currentAudio,
    showAgenda,
    changeShowAgenda,
    showEndScreen,
    changeShowEndScreen,
    lastGenerated,
    handleUndoAction,
    handleRedoAction,
    historyIndex: index,
    history,
    filterSlides,
    filterSkippedSlides,
    updateLastGenerated,
    updateContent,
    currentElement,
    switchToNextElement,
    updateAccessLevel,
    updateAccessPassword,
    handleCopyPresentation,
    isCopied,
    showTitle,
    changeShowTitle,
    switchDimmedImage,
    loadingImageContentId,
    loadingImageSlideId,
    generateImage,
    handleImageUpload,
    slideLoading,
    setSlideLoading,
    handleShowMeSelectedText,
    selectedText,
    onHideSelectedText,
    getPresentationHiddenImprovements,
    handleMoveLayout,
    toggleTheme,
    theme,
    template,
    presentationTemplateInfo,
    toggleTemplate,
    countAgendaSlides,
    exportOpen,
    setExportOpen,
    isExporting,
    setSelectedLanguage,
    selectedLanguage,
    originLanguage,
    showFeedbackModal,
    closeFeedbackModal,
    feedbackPresentationId,
    splitSlideByBullets,
    fontSizes,
    setFontSizes,
    exportingVideo,
    handleTransformImage,
    transformOpen,
    setTransformOpen,
  };
};

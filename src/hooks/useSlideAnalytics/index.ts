import SlideService from '@/api/slideService';
import { PresentationContext } from '@/contexts/Presentation.context';
import { Category } from '@/helpers/constants/text-limits.const';
import {
  IContent,
  IImproveSlideImageContent,
  IImproveSlideRequest,
  IImproveSlideResponse,
  IPresentation,
} from '@/interfaces/ISlides';
import { useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { IBrokenSlide, IImageResult, IUseSlideAnalytics } from './interfaces';
import { slideChecks } from './helpers';
import { updateTranslatableField } from '@/helpers/utils/updateTranslatabeField';
import { handleTextFix } from './helpers/handleTextFix';
import { handleImageFix } from './helpers/handleImageFix';
import { handleBulletsFix } from './helpers/handleBulletsFix';
import { handleAllTableFix } from './helpers/handleAllTableFix';
import PresentationService from '@/api/presentationService';

export const useSlideAnalytics = (): IUseSlideAnalytics => {
  const {
    activeSlide,
    presentation: toAnalyze,
    updateContent,
    updateSlide,
    getPresentationHiddenImprovements,
    selectedLanguage,
    splitSlideByBullets,
    changeImageFromStock,
  } = useContext(PresentationContext);
  const [result, setResult] = useState<IBrokenSlide[]>([]);
  const [presentation, setPresentation] = useState<IPresentation | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadElement, setLoadElement] = useState<string[]>([]);

  const memoizedValues = useMemo(() => {
    return {
      currentPresentationSlides: presentation?.slides || [],
      generationFinished: presentation?.generationFinished,
      textAmount: presentation?.textAmount || 0,
    };
  }, [presentation]);

  useEffect(() => {
    const t = setTimeout(() => {
      setPresentation(toAnalyze);
    }, 1000);

    return () => clearTimeout(t);
  }, [toAnalyze]);

  useEffect(() => {
    const analyze = async () => {
      if (!memoizedValues.currentPresentationSlides.length) {
        return;
      }

      const res: IBrokenSlide[] = [];

      if (memoizedValues.currentPresentationSlides) {
        for (const slide of memoizedValues.currentPresentationSlides) {
          if (slideChecks[slide.slideType as keyof typeof slideChecks]) {
            const result = await slideChecks[slide.slideType as keyof typeof slideChecks](
              slide,
              memoizedValues.textAmount as Category,
              selectedLanguage,
            );

            if (result.length > 0) {
              for (const checkResult of result) {
                res.push({
                  slideId: slide.id,
                  slideNumber: slide.slideNumber,
                  result: checkResult,
                });
              }
            }
          }
        }
      }

      const presentationHiddenImprovements = getPresentationHiddenImprovements();

      const filteredImprovements = res.filter((improvement) => {
        return !presentationHiddenImprovements.some(
          (hiddenImprovements) =>
            hiddenImprovements.slideId === improvement.slideId &&
            hiddenImprovements.content === improvement.result.resultId,
        );
      });

      setLoading(false);

      setResult(filteredImprovements);
    };

    if (memoizedValues.currentPresentationSlides.length > 0) {
      analyze();
    }
  }, [memoizedValues, selectedLanguage, getPresentationHiddenImprovements]);

  const handleRemoveImprovement = async (
    slideId: string,
    slideNumber: number,
    resultId: string,
  ) => {
    try {
      setLoading(true);

      await SlideService.hideSlideImprovements(slideId, slideNumber, resultId);

      setResult((prevImprovements) => {
        return prevImprovements.filter(
          (hiddenImprovements) =>
            hiddenImprovements.slideId !== slideId ||
            hiddenImprovements.result.resultId !== resultId ||
            hiddenImprovements.slideNumber !== slideNumber,
        );
      });
    } catch (error) {
      console.error('An error occurred while removing the improvement.', error);
      toast.error('An error occurred, please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFixAllSlide = async (slideToImprove: IBrokenSlide[]) => {
    if (!presentation) return null;
    setLoading(true);

    const dataForImprove: IImproveSlideRequest[] = slideToImprove
      .map((item) => {
        const { type, slideId, contentId } = item.result;

        switch (type) {
          case 'text': {
            const { result, min, max, key } = item.result;
            const type = result === 'longText' ? 'shorter-text' : 'longer-text';

            return {
              slideId,
              presentationId: presentation.id,
              contentId,
              key,
              text: item.result.resultId,
              type,
              min,
              max,
              langId: selectedLanguage,
              sentencesMax: item.result.sentencesMax,
            } as IImproveSlideRequest;
          }

          // case 'image': {
          //   return {
          //     slideId,
          //     presentationId: presentation.id,
          //     contentId,
          //     type,
          //     description: presentation.description,
          //     langId: selectedLanguage,
          //   } as IImproveSlideRequest;
          // }
          default:
            return null;
        }
      })
      .filter((d): d is IImproveSlideRequest => d !== null);

    try {
      const response = await SlideService.improveAllSlides(dataForImprove);

      if (response?.data && Array.isArray(response.data.data)) {
        response.data.data.forEach((improvedData: IImproveSlideResponse) => {
          const { slideId, contentId, key, content } = improvedData;

          if (key === 'image') {
            const imageContent = content as IImproveSlideImageContent;
            if (!contentId) {
              const updatedSlide = presentation.slides.find((s) => s.id === slideId);
              if (updatedSlide) {
                updatedSlide.accentImage = imageContent.imageUrl;
                updatedSlide.accentImageKey = imageContent.imageKey;
                updatedSlide.accentImageGeneratedAt = new Date();
                updateSlide(updatedSlide);
              }
            } else {
              const updatedContent = presentation.slides
                .find((s) => s.id === slideId)
                ?.content?.find((c) => c.id === contentId) as IContent;

              if (updatedContent) {
                updatedContent.image = imageContent.imageUrl;
                updatedContent.imageKey = imageContent.imageKey;
                updatedContent.imageGeneratedAt = new Date();
                updateContent(updatedContent, slideId);
              }
            }
          } else {
            const textContent = content as string;
            if (!contentId) {
              const existedSlide = presentation.slides.find((s) => s.id === slideId);
              if (existedSlide) {
                const updatedSlide = updateTranslatableField(
                  existedSlide,
                  key,
                  textContent,
                  selectedLanguage,
                  presentation.language === selectedLanguage,
                );

                updateSlide(updatedSlide);
              }
            } else {
              const existedContent = presentation.slides
                .find((s) => s.id === slideId)
                ?.content?.find((c) => c.id === contentId) as IContent;

              if (existedContent && key) {
                const updatedContent = updateTranslatableField(
                  existedContent,
                  key,
                  textContent,
                  selectedLanguage,
                  presentation.language === selectedLanguage,
                );

                updateContent(updatedContent, slideId);
              }
            }
          }
        });
      } else {
        throw new Error('Invalid response format');
      }

      const tableImprovments = slideToImprove.filter((item) =>
        ['table'].includes(item.result.type),
      );
      if (tableImprovments.length) {
        handleAllTableFix(tableImprovments, presentation, updateSlide);
      }
      setResult([]);
      toast.success('The slide have been improved successfully!');
    } catch (error) {
      console.error('Error while fixing the slide:', error);
      toast.error('Something went wrong while improving the slide. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpscale = async (result: IImageResult) => {
    setLoadElement(prev => [...prev, result.resultId]);
    try {
      const response = await PresentationService.upscaleImage(
        result.image,
        activeSlide?.accentImage,
      );
      if (response) {
        const { imageUrl, imageKey, imageUrlGeneratedAt } = response;
        changeImageFromStock(
          imageUrl,
          imageKey,
          imageUrlGeneratedAt,
          result?.slideId,
          result?.contentId,
        );
      }
    } catch (error) {
      console.error(error);
    }
    setLoadElement(prev => prev.filter(i => i !== result.resultId));
  };
  
  const handleFix = async (toFix: IBrokenSlide) => {
    if (!presentation || toFix.result.type === 'unparsed_image') return null;

    setLoadElement(prev => [...prev, toFix.result.resultId]);

    let res: boolean = false;

    switch (toFix.result.type) {
      case 'text': {
        res = await handleTextFix(
          toFix,
          selectedLanguage,
          presentation,
          updateContent,
          updateSlide,
        );
        break;
      }
      case 'image': {
        res = await handleImageFix(toFix, presentation, updateContent, updateSlide);
        break;
      }
      case 'bullets': {
        res = handleBulletsFix(toFix, presentation, splitSlideByBullets, updateSlide);
        break;
      }
      case 'table': {
        res = await handleAllTableFix([toFix], presentation, updateSlide);
        break;
      }
      default: {
        setLoadElement(prev => prev.filter(i => i !== toFix.result.resultId));
        return null;
      }
    }
    if (!res) {
      toast('Something went wrong, please try again');
      return;
    }
    setResult((prev) => prev.filter((res) => res.result.resultId !== toFix.result.resultId));
    setLoadElement(prev => prev.filter(i => i !== toFix.result.resultId));
  };

  const getSlideImprovements = (slideNumber?: number) => {
    return result.filter((i) => i.slideNumber === slideNumber);
  };

  const isSlideParsed = (slideNumber?: number) => {
    return (
      result.filter((i) => i.slideNumber === slideNumber && i.result.type === 'unparsed_image')
        .length === 0
    );
  };

  return {
    result,
    handleFix,
    loading,
    loadElement,
    handleFixAllSlide,
    handleRemoveImprovement,
    getSlideImprovements,
    isSlideParsed,
    onUpscale: handleUpscale,
  };
};

export * from './interfaces';

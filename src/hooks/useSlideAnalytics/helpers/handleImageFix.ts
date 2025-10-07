import { IContent, IPresentation, ISlide } from '@/interfaces/ISlides';
import { IBrokenSlide } from '../interfaces';
import presentationService from '@/api/presentationService';
import { SURPRISE_ME_IMAGE_PROMPT } from '@/helpers/constants/prompt.const';

export const handleImageFix = async (
  toFix: IBrokenSlide,
  presentation: IPresentation,
  updateContent: (content: IContent, slideId: string) => void,
  updateSlide: (slide: ISlide) => void,
): Promise<boolean> => {
  const data = await presentationService.generateNewImage(
    SURPRISE_ME_IMAGE_PROMPT(presentation?.description),
    presentation?.imageStyle,
  );

  if (!data) {
    return false;
  }

  if (!toFix.result.contentId) {
    const updatedSlide = presentation?.slides.find((s) => s.id === toFix.slideId);

    if (!updatedSlide) {
      return false;
    }

    updatedSlide.accentImage = data.imageUrl;
    updatedSlide.accentImageKey = data.imageKey;
    updatedSlide.accentImageGeneratedAt = data.imageUrlGeneratedAt;

    updateSlide(updatedSlide);
  } else {
    const updatedContent = presentation?.slides
      .find((s) => s.id === toFix.slideId)
      ?.content?.find((c) => c.id === toFix.result.contentId);

    if (!updatedContent) {
      return false;
    }

    updatedContent.image = data.imageUrl;
    updatedContent.imageKey = data.imageKey;
    updatedContent.imageGeneratedAt = data.imageUrlGeneratedAt;

    updateContent(updatedContent, toFix.slideId);
  }
  return true;
};

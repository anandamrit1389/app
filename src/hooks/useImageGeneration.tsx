import OpenAIService from '@/api/openAiService';
import PresentationService from '@/api/presentationService';
import { createNewImage } from '@/helpers/utils/images';
import { GalleryImage, S3ImgCategory } from '@/interfaces/images-gallery.interface';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface UseImageGenerationReturn {
  isGenerating: boolean;
  generatedImage: GalleryImage | undefined;
  handleGenerateImage: (
    prompt: string,
    referenceImage?: GalleryImage,
    onSuccess?: () => void,
  ) => Promise<void>;
  setGeneratedImage: (image: GalleryImage | undefined) => void;
}

export const useImageGeneration = (
  addNewImage: (image: GalleryImage) => void,
): UseImageGenerationReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<GalleryImage | undefined>();

  const { t } = useTranslation('translation', { keyPrefix: 'analytics' });

  const handleGenerateImage = async (
    prompt: string,
    referenceImage?: GalleryImage,
    onSuccess?: () => void,
  ) => {
    setIsGenerating(true);

    try {
      if (referenceImage) {
        if (referenceImage.imageKey.endsWith('.webp')) {
          toast.error(t('noWebpSupport2'));
          return;
        }

        const response = await OpenAIService.imageTransform({
          prompt,
          imageUrl: referenceImage.imageUrl,
        });

        const transformedImage: GalleryImage = {
          id: referenceImage.id,
          imageUrl: response.data.imageUrl,
          imageKey: response.data.imageKey,
          type: S3ImgCategory.AI_GENERATED,
          createdAt: new Date().toISOString(),
        };

        addNewImage(transformedImage);
        setGeneratedImage(transformedImage);
        onSuccess?.();
      } else {
        const response = await PresentationService.generateNewImage(prompt);
        const newImage: GalleryImage = createNewImage(response);
        addNewImage(newImage);
        setGeneratedImage(newImage);
        onSuccess?.();
      }
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generatedImage,
    handleGenerateImage,
    setGeneratedImage,
  };
};

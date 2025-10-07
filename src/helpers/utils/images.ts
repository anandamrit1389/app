import { GalleryImage, ImageResponse, S3ImgCategory } from '@/interfaces/images-gallery.interface';
import { ITemplate } from '@/interfaces/ISlides';

export const downloadImage = (blob: Blob, imageId: string | number) => {
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  const extension = 'jpg';
  const fileName = `image-${imageId}.${extension}`;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};

export const createNewImage = (response: ImageResponse): GalleryImage => ({
  id: Date.now().toString(),
  imageUrl: response.imageUrl,
  imageKey: response.imageKey,
  type: S3ImgCategory.AI_GENERATED,
  createdAt: new Date().toISOString(),
});

export const handleBackgroundImage = (
  slideType: string,
  templateInfo: ITemplate,
  imageToChange?: string,
) => {
  if (!slideType || !templateInfo) return;
  const elements = document.querySelectorAll(`.type-${slideType}`);
  const activeSlide = document.querySelectorAll('.swiper-slide-active');

  elements.forEach((el) => {
    const element = el as HTMLElement;
    if (activeSlide.length && !hasSwiperSlideActiveParent(element)) {
      return;
    }
    element.style.setProperty('background-image', imageToChange || 'none');
    element.style.setProperty('--titleBg', imageToChange ? 'none' : '');
    element.style.setProperty('--pageBg', imageToChange ? 'none' : '');
  });
};

const hasSwiperSlideActiveParent = (element: HTMLElement | null): boolean => {
  if (!element) return false;

  let currentElement = element.parentElement;

  while (currentElement) {
    if (currentElement.classList.contains('swiper-slide-active')) {
      return true;
    }
    currentElement = currentElement.parentElement;
  }

  return false;
};

export const getImageResolution = (
  imageUrl: string,
  options?: { onError?: (imageUrl: string) => void },
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageUrl;
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const width = img.width;
      const height = img.height;
      resolve({ width, height });
    };

    img.onerror = (error) => {
      options?.onError?.(imageUrl);
      reject(error);
    };
  });
};

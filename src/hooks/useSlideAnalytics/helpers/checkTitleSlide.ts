import { imageLimits, limits } from '@/helpers/constants/text-limits.const';
import { CheckFunction, IResult } from '../interfaces';
import { getImageResolution } from '@/helpers/utils/images';
import { getLengthLimits } from '@/helpers/constants/languages.const';

export const checkTitleSlide: CheckFunction = async (slide, textAmount, langId) => {
  const result: IResult[] = [];

  const [min, max] = getLengthLimits(
    langId,
    limits.titleSlide[textAmount].titleMin,
    limits.titleSlide[textAmount].titleMax,
  );

  const title = slide.titleTranslations[langId] || slide.title;

  if (title.length > max) {
    result.push({
      result: 'longText',
      color: '#FFAB24',
      resultId: title,
      key: 'title',
      type: 'text',
      text: title,
      slideId: slide.id,
      max: max,
    });
  } else if (title.length < min) {
    result.push({
      result: 'shortText',
      color: '#FFAB24',
      resultId: title,
      key: 'title',
      type: 'text',
      text: title,
      slideId: slide.id,
      min: min,
    });
  }

  if (slide.accentImage) {
    try {
      const { width, height } = await getImageResolution(slide.accentImage, {
        onError: (imageUrl) => {
          result.push({
            result: 'imageLoadError',
            color: '#FFAB24',
            resultId: slide.accentImageKey || imageUrl,
            image: imageUrl,
            slideId: slide.id,
            type: 'image',
          });
        },
      });
      if (width < imageLimits.minSlideWidth || height < imageLimits.minSlideHeight) {
        result.push({
          result: 'lowRes',
          color: '#FFAB24',
          resultId: slide.accentImage,
          image: slide.accentImage,
          slideId: slide.id,
          type: 'image',
        });
      } else if (
        width / height < imageLimits.minAspectRatio ||
        width / height > imageLimits.maxAspectRatio
      ) {
        result.push({
          result: 'unusualAspectRatio',
          color: '#FFAB24',
          resultId: slide.accentImage,
          image: slide.accentImage,
          slideId: slide.id,
          type: 'image',
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  return result;
};

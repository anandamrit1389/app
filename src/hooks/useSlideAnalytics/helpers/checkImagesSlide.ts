import { getImageResolution } from '@/helpers/utils/images';
import { IResult, CheckFunction } from '../interfaces';
import { imageLimits } from '@/helpers/constants/text-limits.const';

export const checkImagesSlide: CheckFunction = async (slide) => {
  const result: IResult[] = [];

  if (slide && slide.content.length === 1) {
    const content = slide.content[0];

    if (content.imageKey && content.imageKey.includes('convertedSlides')) {
      result.push({
        result: 'notConvertedSlide',
        color: '#312929',
        contentId: content.id,
        type: 'unparsed_image',
        resultId: content.imageKey || content.image || '',
        slideId: slide.id,
      });
    }
    return result;
  }

  for (const c of slide.content) {
    if (c.image) {
      try {
        const { width, height } = await getImageResolution(c.image);

        if (width < imageLimits.minContentWidth || height < imageLimits.minContentHeight) {
          result.push({
            result: 'lowRes',
            color: '#FFAB24',
            resultId: c.imageKey || c.image,
            image: c.image,
            slideId: slide.id,
            contentId: c.id,
            type: 'image',
          });
        } else if (
          width / height < imageLimits.minAspectRatio ||
          width / height > imageLimits.maxAspectRatio
        ) {
          result.push({
            result: 'unusualAspectRatio',
            color: '#FFAB24',
            resultId: c.imageKey || c.image,
            image: c.image,
            slideId: slide.id,
            contentId: c.id,
            type: 'image',
          });
        }
      } catch (e) {
        console.error(e);
      }
    } else if (!c.image || c.image === 'broken') {
      result.push({
        result: 'imageLoadError',
        color: '#FFAB24',
        resultId: c.id,
        image: '',
        slideId: slide.id,
        contentId: c.id,
        type: 'image',
      });
    }
  }
  return result;
};

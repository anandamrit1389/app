import { imageLimits, limits } from '@/helpers/constants/text-limits.const';
import { CheckFunction, IResult } from '../interfaces';
import { getImageResolution } from '@/helpers/utils/images';
import { getLengthLimits } from '@/helpers/constants/languages.const';

export const checkImageCaptionSlide: CheckFunction = async (slide, textAmount, langId) => {
  const result: IResult[] = [];

  const [, maxTitle] = getLengthLimits(
    langId,
    limits.imageCaptionSlide[textAmount].titleMin,
    limits.imageCaptionSlide[textAmount].titleMax,
  );

  const [, maxText] = getLengthLimits(
    langId,
    limits.imageCaptionSlide[textAmount].textMin,
    limits.imageCaptionSlide[textAmount].textTotalMax,
  );

  const [, maxSubtitle] = getLengthLimits(
    langId,
    limits.imageCaptionSlide[textAmount].subtitleMin,
    limits.imageCaptionSlide[textAmount].subtitleMax,
  );

  const title = slide.titleTranslations[langId] || slide.title;
  if (title.length > maxTitle) {
    result.push({
      result: 'longText',
      color: '#FFAB24',
      resultId: title,
      key: 'title',
      type: 'text',
      text: title,
      slideId: slide.id,
      max: maxTitle,
    });
  }

  for (const c of slide.content) {
    const title = c.titleTranslations?.[langId] || c.title;
    const text = c.textTranslations?.[langId] || c.text;
    const subtitle = c.subtitleTranslations?.[langId] || c.subtitle;
    if (title && title.length > maxTitle) {
      result.push({
        result: 'longText',
        color: '#FFAB24',
        resultId: title,
        contentId: c.id,
        key: 'title',
        type: 'text',
        text: title,
        slideId: slide.id,
        max: maxTitle,
      });
    } else if (text && text.length >= maxText) {
      result.push({
        result: 'longText',
        color: '#FFAB24',
        resultId: text,
        contentId: c.id,
        key: 'text',
        type: 'text',
        text: text,
        slideId: slide.id,
        max: maxText,
      });
    } else if (subtitle && subtitle.length >= maxSubtitle) {
      result.push({
        result: 'longText',
        color: '#FFAB24',
        resultId: subtitle,
        contentId: c.id,
        key: 'subtitle',
        type: 'text',
        text: subtitle,
        slideId: slide.id,
        max: maxSubtitle,
      });
    }

    if (c.image) {
      try {
        const { width, height } = await getImageResolution(c.image, {
          onError: (imageUrl) => {
            result.push({
              result: 'imageLoadError',
              color: '#FFAB24',
              resultId: c.imageKey || imageUrl,
              image: imageUrl,
              slideId: slide.id,
              contentId: c.id,
              type: 'image',
            });
          },
        });

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
    }
  }

  return result;
};

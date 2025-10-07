import { bulletSlideLimits, imageLimits } from '@/helpers/constants/text-limits.const';
import { CheckFunction, IResult } from '../interfaces';
import { getLengthLimits } from '@/helpers/constants/languages.const';
import { listVariations } from '@/components/PresentationEditor/SlideFactory/Slides/variations/bullets-slide';
import { getSlideVariation } from '@/helpers/utils/renderHelpers';
import { getImageResolution } from '@/helpers/utils/images';

const isVisibleAndTooLong = (
  value: string | undefined,
  maxLength: number,
  className?: string,
): boolean => {
  if (!value) return false;
  if (className && className.split(' ').includes('hidden')) return false;
  return value.length > maxLength;
};

export const checkBulletPointSlide: CheckFunction = async (slide, textAmount, langId) => {
  const result: IResult[] = [];
  const variation = getSlideVariation(listVariations, slide.variation);

  const amountLimits = bulletSlideLimits[textAmount];
  const variationLimits = amountLimits?.[slide.variation];

  const [, maxTitle] = getLengthLimits(
    langId,
    variationLimits?.titleMin || 0,
    variationLimits?.titleMax || 0,
  );

  const [, subtitleMax] = getLengthLimits(
    langId,
    variationLimits?.subtitleMin,
    variationLimits?.subtitleMax,
  );

  const title = slide.titleTranslations?.[langId] || slide.title;
  const subtitle = slide.subtitleTranslations?.[langId] || slide.subtitle;

  if (isVisibleAndTooLong(title, maxTitle, variation?.slideHeadingClassName)) {
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

  if (subtitle && isVisibleAndTooLong(subtitle, subtitleMax, variation?.subtitleClassName)) {
    result.push({
      result: 'longText',
      color: '#FFAB24',
      resultId: subtitle,
      key: 'subtitle',
      type: 'text',
      text: subtitle,
      slideId: slide.id,
      max: maxTitle,
    });
  }

  if (
    slide.accentImage &&
    (variation?.imageClassName === undefined ||
      !variation.imageClassName.split(' ').includes('hidden'))
  ) {
    try {
      const { width, height } = await getImageResolution(slide.accentImage, {
        onError: (imageUrl) => {
          result.push({
            result: 'imageLoadError',
            color: '#FFAB24',
            resultId: slide.accentImageKey || imageUrl,
            type: 'image',
            image: imageUrl,
            slideId: slide.id,
          });
        },
      });

      if (width < imageLimits.minSlideWidth || height < imageLimits.minSlideHeight) {
        result.push({
          result: 'lowRes',
          color: '#FFAB24',
          resultId: slide.accentImageKey || slide.accentImage,
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
          resultId: slide.accentImageKey || slide.accentImage,
          image: slide.accentImage,
          slideId: slide.id,
          type: 'image',
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  if (slide.content.length <= variationLimits?.bulletsMin) {
    result.push({
      result: 'convertToText',
      color: '#FFAB24',
      resultId: `convertToText_${slide.content.length}`,
      type: 'bullets',
      bulletSuggestion: 'convertToText',
      slideId: slide.id,
      count: variationLimits?.bulletsMin,
    });
  }

  const layoutCfg: Record<string, { maxBullets: number; textMul: number; sentences: number }> = {
    list: { maxBullets: 6, textMul: 1.2, sentences: 2 },
    twoCol: { maxBullets: 4, textMul: 0.9, sentences: 1 },
    cardLike: { maxBullets: 4, textMul: 0.8, sentences: 1 },
  };
  const cfg = layoutCfg[slide.variation] ?? { maxBullets: 5, textMul: 1.0, sentences: variationLimits?.sentencesMax || 2 };
  
  const maxBulletsForLayout = cfg.maxBullets;
  
  if (slide.content.length > maxBulletsForLayout) {
    result.push({
      result: 'splitSlide',
      color: '#FFAB24',
      resultId: `splitSlide_${slide.content.length}`,
      type: 'bullets',
      bulletSuggestion: 'splitSlide',
      slideId: slide.id,
      count: maxBulletsForLayout,
    });
  }

  const [, titleContentMax] = getLengthLimits(
    langId,
    variationLimits?.titleContentMin,
    variationLimits?.titleContentMax,
  );

  const [, textContentMax] = getLengthLimits(
    langId,
    variationLimits?.textContentMin,
    variationLimits?.textContentMax,
  );

  for (const c of slide.content) {
    const text = c.textTranslations?.[langId] || c.text;
    const title = c.titleTranslations?.[langId] || c.title;

    if (title && isVisibleAndTooLong(title, titleContentMax, variation?.contentSubtitleClassName)) {
      result.push({
        result: 'longText',
        color: '#FFAB24',
        resultId: title,
        contentId: c.id,
        key: 'title',
        type: 'text',
        text: title,
        slideId: slide.id,
        max: subtitleMax,
      });
    }

    if (text) {
      const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 0);

      const maxTextLengthForLayout = textContentMax * (cfg.textMul ?? 1.0);
      const maxSentencesForLayout = cfg.sentences ?? (variationLimits?.sentencesMax || 2);

      if (
        sentences.length > maxSentencesForLayout ||
        text.length > maxTextLengthForLayout
      ) {
        result.push({
          result: 'longText',
          color: '#FFAB24',
          resultId: text,
          contentId: c.id,
          key: 'text',
          type: 'text',
          text: text,
          slideId: slide.id,
          sentencesMax: maxSentencesForLayout,
          max: maxTextLengthForLayout,
        });
      }
    }

    if (
      c.image &&
      (variation?.imageClassName === undefined ||
        !variation.imageClassName.split(' ').includes('hidden'))
    ) {
      try {
        const { width, height } = await getImageResolution(c.image, {
          onError: (imageUrl) => {
            result.push({
              result: 'imageLoadError',
              color: '#FFAB24',
              resultId: c.imageKey || imageUrl,
              image: imageUrl,
              slideId: slide.id,
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

import { imageLimits, PresentationConstraintsMap } from '@/helpers/constants/text-limits.const';
import { CheckFunction, IResult } from '../interfaces';
import { getImageResolution } from '@/helpers/utils/images';
import { getLengthLimits } from '@/helpers/constants/languages.const';
import { countTextLines } from '@/helpers/utils/text';

const limits: PresentationConstraintsMap = {
  inspirational: {
    titleMin: 10,
    titleMax: 52,
    textMin: 100,
    textTotalMax: 300,
    textTopMax: 250,
    textBottomMax: 250,
    textWithoutHeadingMax: 200,
  },
  business: {
    titleMin: 10,
    titleMax: 52,
    textMin: 100,
    textTotalMax: 300,
    textTopMax: 250,
    textBottomMax: 250,
    textWithoutHeadingMax: 200,
  },
  academic: {
    titleMin: 10,
    titleMax: 52,
    textMin: 100,
    textTotalMax: 300,
    textTopMax: 250,
    textBottomMax: 250,
    textWithoutHeadingMax: 200,
  },
  keynote: {
    titleMin: 10,
    textMin: 100,

    titleMaxLines: 1,
    titleMaxLineLength: 52,

    textMaxLines: 12,
    textMaxLineLength: 75,
    text2MaxLineLength: 95,

    textTopBottomMaxLines: 4,
    textTopBottomMaxLineLength: 72,

    textBolderMaxLines: 8,
    textWithoutHeadingMaxLines: 9,
    textBolderMaxLineLength: 54,
  },
};

export const checkImageTextSlide: CheckFunction = async (slide, textAmount, langId) => {
  const result: IResult[] = [];

  const titleMaxLines = limits[textAmount].titleMaxLines;
  const textMaxLines = limits[textAmount].textMaxLines;
  const textTopBottomMaxLines = limits[textAmount].textTopBottomMaxLines;
  const textBolderMaxLines = limits[textAmount].textBolderMaxLines;
  const textWithoutHeadingMaxLines = limits[textAmount].textWithoutHeadingMaxLines;

  const [minTitle, maxTitle] = getLengthLimits(
    langId,
    limits[textAmount].titleMin,
    limits[textAmount].titleMaxLineLength,
  );

  const [, maxTextWithoutHeading] = getLengthLimits(
    langId,
    0,
    limits[textAmount].textWithoutHeadingMax,
  );

  const [minText, textMaxLineLength] = getLengthLimits(
    langId,
    limits[textAmount].textMin,
    limits[textAmount].textMaxLineLength,
  );

  const [, text2MaxLineLength] = getLengthLimits(langId, 0, limits[textAmount].text2MaxLineLength);

  const [, textTopBottomMaxLineLength] = getLengthLimits(
    langId,
    0,
    limits[textAmount].textTopBottomMaxLineLength,
  );

  const [, textBolderMaxLineLength] = getLengthLimits(
    langId,
    0,
    limits[textAmount].textBolderMaxLineLength,
  );

  for (const c of slide.content) {
    const title = c.titleTranslations?.[langId] || c.title;
    const text = c.textTranslations?.[langId] || c.text;
    if (
      title &&
      !slide.variation.includes('-withoutHeading') &&
      countTextLines(title, maxTitle) > titleMaxLines
    ) {
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
    } else if (title && title.length < minTitle) {
      result.push({
        result: 'shortText',
        color: '#FFAB24',
        resultId: title,
        contentId: c.id,
        key: 'title',
        type: 'text',
        text: title,
        slideId: slide.id,
        min: minTitle,
      });
    }

    if (text) {
      if (
        (['right', 'left'].includes(slide.variation) &&
          countTextLines(text, textMaxLineLength) > textMaxLines) ||
        (['right-1/3-withoutHeading', 'left-1/3-withoutHeading'].includes(slide.variation) &&
          countTextLines(text, textBolderMaxLineLength) > textWithoutHeadingMaxLines) ||
        (['top', 'bottom'].includes(slide.variation) &&
          countTextLines(text, textTopBottomMaxLineLength) > textTopBottomMaxLines) ||
        (['right-bolder', 'left-bolder'].includes(slide.variation) &&
          countTextLines(text, textBolderMaxLineLength) > textBolderMaxLines) ||
        (['right-1/3', 'left-1/3'].includes(slide.variation) &&
          countTextLines(text, text2MaxLineLength) > textMaxLines)
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
          max: maxTextWithoutHeading,
        });
      } else if (text.length < minText) {
        result.push({
          result: 'shortText',
          color: '#FFAB24',
          resultId: text,
          contentId: c.id,
          key: 'text',
          type: 'text',
          text: text,
          slideId: slide.id,
          min: minText,
        });
      }
    }
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

  return result;
};

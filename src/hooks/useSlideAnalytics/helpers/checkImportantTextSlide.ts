import { PresentationConstraintsMap } from '@/helpers/constants/text-limits.const';
import { CheckFunction, IResult } from '../interfaces';
import { getLengthLimits } from '@/helpers/constants/languages.const';
import { countTextLines } from '@/helpers/utils/text';

const limits: PresentationConstraintsMap = {
  inspirational: {
    titleMin: 10,
    textMin: 25,
    subtitleMin: 10,
    titleMaxLines: 2,
    subtitleMaxLines: 2,
    textMaxLines: 8,
    titleMaxLineLength: 85,
    subtitleMaxLineLength: 88,
    textMaxLineLength: 60,
  },
  business: {
    titleMin: 10,
    textMin: 25,
    subtitleMin: 10,
    titleMaxLines: 2,
    subtitleMaxLines: 2,
    textMaxLines: 8,
    titleMaxLineLength: 85,
    subtitleMaxLineLength: 88,
    textMaxLineLength: 60,
  },
  academic: {
    titleMin: 10,
    textMin: 25,
    subtitleMin: 10,
    titleMaxLines: 2,
    subtitleMaxLines: 2,
    textMaxLines: 8,
    titleMaxLineLength: 85,
    subtitleMaxLineLength: 88,
    textMaxLineLength: 60,
  },
  keynote: {
    titleMin: 10,
    textMin: 25,
    subtitleMin: 10,
    titleMaxLines: 2,
    subtitleMaxLines: 2,
    textMaxLines: 8,
    titleMaxLineLength: 85,
    subtitleMaxLineLength: 88,
    textMaxLineLength: 60,
  },
};

export const checkImportantTextSlide: CheckFunction = (slide, textAmount, langId) => {
  const result: IResult[] = [];

  const [minTitle, maxTitle] = getLengthLimits(
    langId,
    limits[textAmount].titleMin,
    limits[textAmount].titleMaxLineLength,
  );

  const [minText, maxText] = getLengthLimits(
    langId,
    limits[textAmount].textMin,
    limits[textAmount].textMaxLineLength,
  );

  const [minSubtitle, maxSubtitle] = getLengthLimits(
    langId,
    limits[textAmount].subtitleMin,
    limits[textAmount].subtitleMaxLineLength,
  );

  const titleMaxLines = limits[textAmount].titleMaxLines;
  const subtitleMaxLines = limits[textAmount].subtitleMaxLines;
  const textMaxLines = limits[textAmount].textMaxLines;

  const title = slide.titleTranslations[langId] || slide.title;

  let shouldConvertToTextSlide = false;
  let totalTextLength = 0;

  for (const c of slide.content) {
    const text = c.textTranslations?.[langId] || c.text;
    if (text) {
      totalTextLength += text.length;
      if (countTextLines(text, maxText) > textMaxLines) {
        shouldConvertToTextSlide = true;
      }
    }
  }

  const isCentralLayout = slide.variation === 'central';
  const maxLengthForLayout = isCentralLayout ? 200 : 300;
  
  if (shouldConvertToTextSlide || totalTextLength > maxLengthForLayout) {
    result.push({
      result: 'longText',
      color: '#FFAB24',
      resultId: 'convertToTextSlide',
      key: 'text',
      type: 'text',
      text: 'Content too long for important text slide',
      slideId: slide.id,
      max: maxLengthForLayout,
    });
    return result;
  }

  if (countTextLines(title, maxTitle) > titleMaxLines) {
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
  } else if (title.length < minTitle) {
    result.push({
      result: 'shortText',
      color: '#FFAB24',
      resultId: title,
      key: 'title',
      type: 'text',
      text: title,
      slideId: slide.id,
      min: minTitle,
    });
  }

  for (const c of slide.content) {
    const text = c.textTranslations?.[langId] || c.text;
    const subtitle = c.subtitleTranslations?.[langId] || c.subtitle;

    if (text && countTextLines(text, maxText) > textMaxLines) {
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
    } else if (text && text.length <= minText) {
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

    if (subtitle && countTextLines(subtitle, maxSubtitle) > subtitleMaxLines) {
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
    } else if (subtitle && subtitle.length <= minSubtitle) {
      result.push({
        result: 'shortText',
        color: '#FFAB24',
        resultId: subtitle,
        contentId: c.id,
        key: 'subtitle',
        type: 'text',
        text: subtitle,
        slideId: slide.id,
        min: minSubtitle,
      });
    }
  }

  return result;
};

import { limits } from '@/helpers/constants/text-limits.const';
import { CheckFunction, IResult } from '../interfaces';
import { getLengthLimits } from '@/helpers/constants/languages.const';

export const checkTextSlide: CheckFunction = (slide, textAmount, langId) => {
  const result: IResult[] = [];

  const [minTitle, maxTitle] = getLengthLimits(
    langId,
    limits.textSlide[textAmount].titleMin,
    limits.textSlide[textAmount].titleMax,
  );

  const [minText, maxText] = getLengthLimits(
    langId,
    limits.textSlide[textAmount].textMin,
    limits.textSlide[textAmount].textTotalMax,
  );

  const [minSubtitle, maxSubtitle] = getLengthLimits(
    langId,
    limits.textSlide[textAmount].subtitleMin,
    limits.textSlide[textAmount].subtitleMax,
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
    if (text && text.length >= maxText) {
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

    if (subtitle && subtitle.length >= maxSubtitle) {
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

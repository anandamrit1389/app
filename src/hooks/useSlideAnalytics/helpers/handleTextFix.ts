import { IContent, IPresentation, ISlide } from '@/interfaces/ISlides';
import { IBrokenSlide, ITextResult } from '../interfaces';
import presentationService from '@/api/presentationService';
import { updateTranslatableField } from '@/helpers/utils/updateTranslatabeField';

export const handleTextFix = async (
  toFix: IBrokenSlide,
  selectedLanguage: string,
  presentation: IPresentation,
  updateContent: (content: IContent, slideId: string) => void,
  updateSlide: (slide: ISlide) => void,
): Promise<boolean> => {
  const result = toFix.result as ITextResult;
  const text = result.text;
  
  const existedSlide = presentation?.slides.find((s) => s.id === toFix.slideId);
  if (!existedSlide) {
    return false;
  }

  if (result.resultId === 'convertToTextSlide' && existedSlide.slideType === 'important-text-slide') {
    const updatedSlide = {
      ...existedSlide,
      slideType: 'text-slide' as const,
      variation: 'long-text',
    };
    updateSlide(updatedSlide);
    return true;
  }

  const data = await presentationService.generateNewText(
    text,
    result.result === 'longText' ? 'shorter-text' : 'longer-text',
    selectedLanguage,
    result.min,
    result.max,
    result.sentencesMax,
  );

  if (!data) {
    return false;
  }

  switch (result.key) {
    case 'cell': {
      if (result.colIndex !== undefined && result.rowIndex !== undefined) {
        if (!existedSlide.tableData) {
          return false;
        }
        const updatedTableData = existedSlide.tableData.map((row) => [...row]);
        updatedTableData[result.rowIndex][result.colIndex] = data;

        const updatedSlide = {
          ...existedSlide,
          tableData: updatedTableData,
        };
        updateSlide(updatedSlide);
      }
      break;
    }
    case 'title':
    case 'text':
    case 'subtitle': {
      if (!toFix.result.contentId) {
        const updatedSlide = updateTranslatableField(
          existedSlide,
          result.key,
          data,
          selectedLanguage,
          presentation.language === selectedLanguage,
        );

        updateSlide(updatedSlide);
      } else {
        const existedContent = existedSlide?.content?.find((c) => c.id === toFix.result.contentId);
        if (!existedContent) {
          return false;
        }

        const key = result.key ?? 'title';
        const updatedContent = updateTranslatableField(
          existedContent,
          key,
          data,
          selectedLanguage,
          presentation.language === selectedLanguage,
        );
        updateContent(updatedContent, toFix.slideId);
      }
      break;
    }
  }
  return true;
};

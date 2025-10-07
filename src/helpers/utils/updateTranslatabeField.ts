import { TableData } from '@/components/PresentationEditor/SlideFactory/Slides/SimpleTable';

export const updateTranslatableField = <T extends object>(
  obj: T,
  field: 'title' | 'subtitle' | 'text' | 'description' | 'tableData',
  value: string | TableData[],
  lang: string,
  isOriginLang: boolean,
): T => {
  const translationField = `${field}Translations` as keyof T;

  const updated: T = {
    ...obj,
    ...(isOriginLang
      ? {
          [field]: value,
        }
      : {
          [translationField]: {
            ...(obj[translationField] || {}),
            [lang]: value,
          },
        }),
  };

  return updated;
};

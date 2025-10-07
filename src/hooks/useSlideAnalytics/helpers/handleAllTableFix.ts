import { IPresentation, ISlide } from '@/interfaces/ISlides';
import { IBrokenSlide, ITableSlideResult } from '../interfaces';

export const handleAllTableFix = async (
  toFixes: IBrokenSlide[],
  presentation: IPresentation,
  updateSlide: (slide: ISlide) => void,
): Promise<boolean> => {
  const rowsToRemove = new Set<number>();
  const colsToRemove = new Set<number>();

  for (const toFix of toFixes) {
    const result = toFix.result as ITableSlideResult;

    if (result.tableSuggestion === 'removeRow') rowsToRemove.add(result.index);
    if (result.tableSuggestion === 'removeCol') colsToRemove.add(result.index);
  }

  const existedSlide = presentation?.slides.find((s) => s.id === toFixes?.[0]?.slideId);

  if (!existedSlide?.tableData) {
    return false;
  }

  const updatedTableData = existedSlide.tableData
    .filter((_, rowIndex) => !rowsToRemove.has(rowIndex))
    .map((row) => row.filter((_, colIndex) => !colsToRemove.has(colIndex)));

  const updatedSlide = {
    ...existedSlide,
    tableData: updatedTableData,
  };
  updateSlide(updatedSlide);

  return true;
};

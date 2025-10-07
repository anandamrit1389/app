import { CheckFunction, IResult } from '../interfaces';

export const checkTableSlide: CheckFunction = (slide) => {
  const result: IResult[] = [];

  const table: string[][] = slide.tableData || [];

  const colCount = Math.max(...table.map((row) => row.length));
  const colStats = Array.from({ length: colCount }, (_, colIndex) => ({
    colIndex,
    maxLen: 0,
    maxRowIndex: -1,
    totalLen: 0,
    filledCount: 0,
    emptyCount: 0,
  }));

  for (let rowIndex = 0; rowIndex < table.length; rowIndex++) {
    const row = table[rowIndex];
    const nonEmptyRowCount = row.filter((cell) => cell.trim() !== '').length;
    if (nonEmptyRowCount <= 1) {
      result.push({
        result: 'emptyRow',
        color: '#FFAB24',
        resultId: `${rowIndex}_${nonEmptyRowCount}`,
        type: 'table',
        index: rowIndex,
        slideId: slide.id,
        tableSuggestion: 'removeRow',
      });
    }
    for (let colIndex = 0; colIndex < colCount; colIndex++) {
      const cell = row[colIndex] ?? '';
      const len = cell.length;

      if (!cell) {
        colStats[colIndex].emptyCount += 1;
        continue;
      }

      colStats[colIndex].filledCount += 1;
      colStats[colIndex].totalLen += len;

      if (len > colStats[colIndex].maxLen) {
        colStats[colIndex].maxLen = len;
        colStats[colIndex].maxRowIndex = rowIndex;
      }
    }
  }

  const sortedByMax = colStats
    .map((stat, colIndex) => ({ ...stat, colIndex }))
    .sort((a, b) => b.maxLen - a.maxLen);

  for (const col of sortedByMax.reverse()) {
    if (col.filledCount <= 1 && col.colIndex !== 0) {
      result.push({
        result: 'emptyColumn',
        color: '#FFAB24',
        resultId: `${col.colIndex}_${col.filledCount}`,
        type: 'table',
        index: col.colIndex,
        slideId: slide.id,
        tableSuggestion: 'removeCol',
      });
    }
  }

  const totalMaxLength = colStats.reduce((sum, c) => sum + c.maxLen, 0);
  
  if (totalMaxLength <= 200) {
    return result;
  }

  for (const col of sortedByMax) {
    if (col.filledCount === 0 || col.filledCount - 1 === 0) continue;

    const avg = (col.totalLen - col.maxLen) / (col.filledCount - 1);
    const peakRatio = col.maxLen / avg;

    if (peakRatio > 1.2) {
      result.push({
        result: 'longText',
        color: '#FFAB24',
        resultId: table[col.maxRowIndex][col.colIndex],
        key: 'cell',
        type: 'text',
        text: table[col.maxRowIndex][col.colIndex],
        colIndex: col.colIndex,
        rowIndex: col.maxRowIndex,
        slideId: slide.id,
        max: avg * 1.1,
      });
    }
  }

  return result;
};

export const countTextLines = (text: string, maxLengthPerLine = 30): number => {
  const lines = text.split(/\r?\n/);
  let total = 0;

  for (const line of lines) {
    if (line === '') {
      total += 1;
    } else {
      const estimatedLines = Math.ceil(line.length / maxLengthPerLine);
      total += estimatedLines;
    }
  }

  return total;
};

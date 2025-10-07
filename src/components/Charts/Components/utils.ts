export const truncateName = (name: string) => {
  const maxLength = 5;
  if (name.length <= maxLength) return name;
  return `${name.substring(0, maxLength)}..`;
};

export const formatYAxis = (tick: number) => {
  if (tick >= 1000000000) {
    return `${(tick / 1000000000).toFixed(1)} B`; // Billion
  } else if (tick >= 1000000) {
    return `${(tick / 1000000).toFixed(1)} M`; // Million
  } else if (tick >= 1000) {
    return `${(tick / 1000).toFixed(1)} K`; // Thousand
  }
  return String(tick);
};

export const generateColorVariations = (baseColor: string, count: number): string[] => {
  return Array.from({ length: count }, (_, index) => {
    const opacityHex = Math.floor((((index + 1) / count) * 0.6 + 0.3) * 255)
      .toString(16)
      .padStart(2, '0')
      .toUpperCase();
    return `${baseColor}${opacityHex}`;
  });
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const getRandomColors = (colorArray: string[], count: number): string[] => {
  const shuffled = shuffleArray(colorArray);
  return shuffled.slice(0, Math.min(count, colorArray.length));
};

import namer from 'color-namer';
import chroma from 'chroma-js';
import { colorCategory } from '../constants/color-namer.const';
import { defaultThemes } from '../constants/themes.const';

export const rgbToHex = (r: number, g: number, b: number): string => {
  const isNormalized = r <= 1 && g <= 1 && b <= 1;

  const toHex = (x: number): string => {
    const value = isNormalized ? Math.round(x * 255) : Math.round(x);
    const hex = value.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return '#' + toHex(r) + toHex(g) + toHex(b);
};

export const getColorTheme = (hexColor: any) => {
  const colorName = namer(hexColor)?.basic[0]?.name || 'gray';
  let convertedColorName = colorCategory[colorName];
  convertedColorName =
    chroma(colorName).luminance() > 0.5 ? convertedColorName : 'dark' + convertedColorName;

  const themeName = Object.values(defaultThemes).find(
    (theme) => theme.id === convertedColorName,
  )?.id;

  return themeName;
};

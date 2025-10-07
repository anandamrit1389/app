import { FontScheme, IFontSet } from '@/interfaces/font.interface';
import { loadFontAsync } from './load-font';

export const getFontScheme = (fonts: IFontSet, id: string): FontScheme => {
  return {
    id: id,
    fonts: fonts,
  };
};

const loadAndApplyFont = async (fontName: string, fontUrl: string, cssVarName: string) => {
  if (fontUrl) {
    await loadFontAsync(fontName, fontUrl);
  }
  document.documentElement.style.setProperty(cssVarName, fontName);
};

export const applyExtraFont = async (scheme: FontScheme) => {
  const {
    id,
    fonts: { header, body },
  } = scheme;
  if (header) {
    await loadAndApplyFont(
      header.label,
      header.key ? header.link : '',
      `--title-font-${id}-family`,
    );
  }

  if (body) {
    await loadAndApplyFont(body.label, body.key ? body.link : '', `--body-font-${id}-family`);
  }
};

export const applyExtraFonts = async (schemes: FontScheme[]) => {
  schemes.forEach((schema) => applyExtraFont(schema));
};

export const getFontSizeInPixels = (
  fontSize: number,
  isMobile?: boolean,
  isSideBarActive?: boolean,
  isFullscreen?: boolean
) => {
  const width = window.innerWidth
  const height = window.innerHeight
  const SLIDES_PREVIEW_WIDTH = !isMobile ? 224 : 30;
  const SIDEBAR_WIDTH = !isMobile ? 350 : 30;

  const uiWidth = !isSideBarActive
    ? SLIDES_PREVIEW_WIDTH
    : SLIDES_PREVIEW_WIDTH + SIDEBAR_WIDTH;

  let screenWidth = width - uiWidth;

  const aspectRatio = 16 / 9;
  const maxSlideHeight = height - 120;

  const heightBasedWidth = maxSlideHeight * aspectRatio;

  if (heightBasedWidth < screenWidth) {
    screenWidth = heightBasedWidth;
  }

  if (isFullscreen) {
    screenWidth = Math.min(width, height * aspectRatio);
  }

  const fontSizePx = (fontSize / 100) * screenWidth;

  return fontSizePx;
};

export const getUniqueFontsFromSchema = (fontScheme: FontScheme) => {
  if (!fontScheme || !fontScheme.fonts) return [];

  const { body, header } = fontScheme.fonts;

  if (!body || !header) return [];

  return body.name === header.name ? [body] : [body, header];
}

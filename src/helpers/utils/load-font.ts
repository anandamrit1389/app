export const loadFont = (name: string, url: string) => {
  const isFontLoaded = Array.from(document.fonts).some((font) => font.family === name);

  if (!isFontLoaded) {
    const fontFace = new FontFace(name, `url(${url})`);
    fontFace.load().then(() => {
      document.fonts.add(fontFace);
    });
  }
};

export const loadFontAsync = async (name: string, url: string): Promise<void> => {
  const isFontLoaded = Array.from(document.fonts).some((font) => font.family === name);

  if (!isFontLoaded) {
    const fontFace = new FontFace(name, `url(${url})`);
    await fontFace.load();
    document.fonts.add(fontFace);
  }
};

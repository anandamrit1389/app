import { useState, useEffect } from 'react';

const useScreenSize = (
  sideBar?: boolean,
  mobile?: boolean,
  fullscreen?: boolean,
  isForExport?: boolean,
) => {
  const [screenWidth, setWidth] = useState(window.innerWidth);
  const [screenHeight, setHeight] = useState(window.innerHeight);

  const SLIDES_PREVIEW_WIDTH = !mobile ? 224 : 30;
  const SIDEBAR_WIDTH = !mobile ? 350 : 30;

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setWidth(width);
      setHeight(height);

      const ui_width = !sideBar ? SLIDES_PREVIEW_WIDTH : SLIDES_PREVIEW_WIDTH + SIDEBAR_WIDTH;
      let screenWidth = width - ui_width;

      const aspectRatio = 16 / 9;
      const maxSlideHeight = height - 120; // Ensuring that the slide fits vertically

      // Calculate the maximum possible width that maintains the aspect ratio without exceeding height
      const heightBasedWidth = maxSlideHeight * aspectRatio;

      if (heightBasedWidth < screenWidth) {
        // If height-based width is smaller than screen width, adjust the width to fit within height
        screenWidth = heightBasedWidth;
      }

      if (fullscreen) {
        screenWidth = Math.min(width, height * aspectRatio);
      }

      if (isForExport) {
        screenWidth = 1920;
      }

      const variables = {
        '--slideMaxWidth': `${screenWidth}px`,
        '--titleFontSize': `${(7.45 / 100) * screenWidth}px`,
        '--presentationMargin': `${(2.5 / 100) * screenWidth}px`,
        '--contentMarginTop': `${(5.83 / 100) * screenWidth}px`,
        '--contentMarginBottom': `${(1.25 / 100) * screenWidth}px`,
        '--headingFontSize': `${(4.79 / 100) * screenWidth}px`,
        '--bodyLg': `${(1.094 / 100) * screenWidth}px`,
        '--smallHeadingFontSize': `${(3.07 / 100) * screenWidth}px`,
        '--subheadline': `${(1.46 / 100) * screenWidth}px`,
        '--smallsubheadlineSize': `${(1.25 / 100) * screenWidth}px`,
        '--sectionHeadingFontSize': `${(2.29 / 100) * screenWidth}px`,
        '--presentationXGap': `${(1.25 / 100) * screenWidth}px`,
        '--normalTextFontSize': `${(1.25 / 100) * screenWidth}px`,
        '--titleDecorationSize': `${(3.5 / 100) * screenWidth}px`,
        '--freeSlideFontSize': `${(1.25 / 100) * screenWidth}px`,
        '--chartMargin': `${(2.08 / 100) * screenWidth}px`,
        '--contentMargin': `${(1.25 / 100) * screenWidth}px`,
        '--freeSlideMargin': `${(0.65 / 100) * screenWidth}px`,
        '--bulletPointSize': `${(0.63 / 100) * screenWidth}px`,
        '--bulletPointAlign': `${(0.78 / 100) * screenWidth}px`,
        '--bulletPointText': `${(0.94 / 100) * screenWidth}px`,
        '--bulletPointWithTextSize': `${(2.08 / 100) * screenWidth}px`,
        '--marginBetweenSlides': `${(15 / 100) * window.innerHeight}px`,
        '--imageSlideLineHeight': `${(25 / 100) * screenWidth}px`,
        '--maxLogoSize': `${(4 / 100) * screenWidth}px`,
        '--shapeBorderSize': `${(2.5 / 100) * screenWidth}px`,
        '--shapeBorderSizeSmall': `${(1 / 100) * screenWidth}px`,
        '--maxIconSize': `${(5.4 / 100) * screenWidth}px`,
        '--marginBottomEndScreen': `${(2.8 / 100) * screenWidth}px`,
        '--simpleTableX': `${(1.8 / 100) * screenWidth}px`,
        '--simpleTableY': `${(1 / 100) * screenWidth}px`,
        '--bodySm': `${(1.2 / 100) * screenWidth}px`,
        '--logoSize': `${(2.5 / 100) * screenWidth}px`,
        '--smallMargin': `${(0.5 / 100) * screenWidth}px`,
        '--statsTextFontSize': `${(0.7 / 100) * screenWidth}px`
      };

      Object.keys(variables).forEach((key) => {
        document.documentElement.style.setProperty(key, variables[key as keyof typeof variables]);
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('load', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', handleResize);
    };
  }, [sideBar, fullscreen, isForExport, screenWidth, screenHeight]);

  return screenWidth;
};

export default useScreenSize;

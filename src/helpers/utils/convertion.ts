import pptxgen from 'pptxgenjs';
import jsPDF from 'jspdf';
import {
  IPresentation,
  ISlide,
  ISlideGenerator,
  ISlideGeneratorElement,
  ISlideGeneratorStyles,
} from '@/interfaces/ISlides';
import domtoimage from 'dom-to-image';
import { pdfjs } from 'react-pdf';
import PresentationService from '@/api/presentationService';
import { ImagePurpose } from '@/interfaces/IPresentation';
import ConverterService from '@/api/converterService';
import { fontExport } from '../constants/fonts.const';
import ElevenLabsService from '@/api/elevenLabsService';
import { getTextFromSlide } from './parsers';

export const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `${r}, ${g}, ${b}`;
};

const rgbToHex = (rgb: string) => {
  if (!rgb) return null;
  const result = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i.exec(rgb);

  if (!result) return rgb;

  const r = parseInt(result[1], 10);
  const g = parseInt(result[2], 10);
  const b = parseInt(result[3], 10);
  const a = result[4] ? parseFloat(result[4]) : 1;

  const enhancedAlpha = Math.min(1, a * 1.5);

  const adjustedR = Math.round(r * enhancedAlpha + (1 - enhancedAlpha) * 255);
  const adjustedG = Math.round(g * enhancedAlpha + (1 - enhancedAlpha) * 255);
  const adjustedB = Math.round(b * enhancedAlpha + (1 - enhancedAlpha) * 255);

  const toHex = (n: number) => {
    const hex = n.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(adjustedR)}${toHex(adjustedG)}${toHex(adjustedB)}`;
};

const pixelsToPoints = (pixels: number) => (pixels * 72) / 96;

const generatePdf = async (container: HTMLDivElement, isPro: boolean, language: string) => {
  const slides = container.querySelectorAll("[class*='slide-container']:not(.skip)");
  const parentElements: HTMLElement[] = [];

  slides.forEach((slide) => {
    const parentElement = slide.parentElement;
    if (parentElement) {
      parentElements.push(parentElement);
    }
  });

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: [1920, 1080],
  });

  const hiddenContainer = document.createElement('div');
  hiddenContainer.style.width = '1920px';
  hiddenContainer.style.height = '1080px';
  hiddenContainer.style.position = 'absolute';
  hiddenContainer.style.top = '9999px';
  hiddenContainer.style.left = '9999px';

  document.body.appendChild(hiddenContainer);

  for (let i = 0; i < parentElements.length; i++) {
    const slide = parentElements[i] as HTMLElement;

    const slideClone = slide.cloneNode(true) as HTMLElement;
    slideClone.querySelectorAll<HTMLElement>('*').forEach((el) => {
      el.classList.remove('overflow-y-auto');
      el.classList.remove('rounded');
      el.style.overflow = 'hidden';
    });
    hiddenContainer.appendChild(slideClone);
    const slideType = [...slideClone.classList].find((cls) => cls.startsWith('type-'));

    const bgElement = slideClone.querySelector('[class*="bg-[#"]') as HTMLElement;

    if (bgElement) {
      const bgColor = window.getComputedStyle(bgElement).backgroundColor;
      const hexColor = rgbToHex(bgColor);
      hexColor && doc.setFillColor(hexColor);
    }

    let selector = 'textarea, input, h1, p';

    if (slideType === 'type-bullet-points-slide') {
      selector = 'textarea, input, h1, p.presTitle';
    }

    const textElements = slideClone.querySelectorAll(selector);
    const originalTextData: Array<{
      element: HTMLElement;
      text: string;
      styles: CSSStyleDeclaration;
    }> = [];

    textElements.forEach((element) => {
      if (element instanceof HTMLElement) {
        const computedStyles = window.getComputedStyle(element);
        originalTextData.push({
          element,
          text: element.textContent || '',
          styles: computedStyles,
        });
        element.style.visibility = 'hidden';
      }
    });

    try {
      const imgData = await domtoimage.toPng(slideClone, { width: 1920, height: 1080 });

      if (i > 0) {
        doc.addPage();
      }

      if (!isPro) {
        doc.link(10, 380, 70, 22, { url: 'https://www.inabit.ai/' });
      }

      doc.addImage(imgData, 'PNG', -5, -5, 1930, 1090, undefined, 'FAST');

      for (const { element, text, styles } of originalTextData) {
        if (!text.trim()) continue;

        const rect = element.getBoundingClientRect();
        const slideRect = slideClone.getBoundingClientRect();

        const x = (rect.left - slideRect.left) * (1920 / slideRect.width);
        const y = (rect.top - slideRect.top) * (1080 / slideRect.height);

        const fontSize = parseFloat(styles.fontSize) * (1920 / slideRect.width);
        const fontFamily = styles.fontFamily;
        const fontWeight = getFontWeight(parseInt(styles.fontWeight) - 100);
        const color = styles.color;
        const align = styles.textAlign === 'center' ? 'center' : 'left';
        const lineHeight = parseFloat(styles.lineHeight) >= 45 ? 1 : 1.4;
        const hexColor = rgbToHex(color);
        hexColor && doc.setTextColor(hexColor);
        doc.setFontSize(fontSize);

        const { paddingRight, paddingLeft } = styles;

        const pr = parseFloat(paddingRight);
        const pl = parseFloat(paddingLeft);

        const fontKey = detectLanguage(text, language, fontWeight, fontFamily);
        if (fontExport[fontKey] || fontExport[`${fontFamily}-normal`]) {
          try {
            const base64 = fontExport[fontKey]
              ? await urlToBase64(fontExport[fontKey])
              : await urlToBase64(fontExport[`${fontFamily}-normal`]);

            doc.addFileToVFS(`${fontFamily}.ttf`, base64);
            doc.addFont(`${fontFamily}.ttf`, fontFamily, fontWeight);
            doc.setFont(fontFamily, fontWeight);
          } catch (error) {
            console.error(`Error loading font ${fontKey}:`, error);
          }
        }

        let maxWidth = rect.width * (1920 / slideRect.width) - 5 - pr - pl;

        if (
          slideType === 'type-content-slide' ||
          slideType === 'type-table-slide' ||
          slideType === 'type-chart-slide'
        ) {
          maxWidth = maxWidth + 10;
        } else if (slideType === 'type-bullet-points-slide') {
          maxWidth = maxWidth - 30;
        }

        if (!isNaN(Number(text.trim()))) {
          maxWidth = maxWidth + 10;
        }

        if (element.classList.contains('presTitle')) {
          maxWidth = maxWidth + 100;
        }

        const lines = doc.splitTextToSize(text, maxWidth);

        lines.forEach((line: string, lineIndex: number) => {
          const lineY = y + lineIndex * fontSize * lineHeight + fontSize;
          let xPos = align === 'center' ? (slideRect.width / 2) * (1920 / slideRect.width) : x;
          doc.text(line, xPos, lineY, { align });
        });
      }
    } catch (error) {
      console.error(`Failed to generate image for slide ${i + 1}:`, error);
    } finally {
      slideClone.remove();
    }
  }
  hiddenContainer.remove();

  return doc;
};

async function urlToBase64(url: string) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += chunk.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
  }

  return btoa(binary);
}
const getFontWeight = (fontWeight: number) => {
  switch (fontWeight) {
    case 400:
      return 'normal';
    case 500:
      return 'semibold';
    case 600:
      return 'bold';
    case 700:
      return 'extrabold';
    default:
      return 'normal';
  }
};

const detectLanguage = (text: string, language: string, fontWeight: string, fontFamily: string) => {
  let fontKey: string;

  switch (language) {
    case 'japanese':
      fontKey =
        /[\u3040-\u30FF]/.test(text) && language === 'japanese'
          ? `NotoSansJP-${fontWeight}`
          : `${fontFamily}-${fontWeight}`;
      break;
    case 'korean':
      fontKey =
        /[\uAC00-\uD7AF]/.test(text) && language === 'korean'
          ? `NotoSansKR-${fontWeight}`
          : `${fontFamily}-${fontWeight}`;
      break;
    case 'chinese_traditional':
      fontKey = `NotoSansTC-${fontWeight}`;
      break;
    case 'chinese_simplified':
      fontKey = `NotoSansSC-${fontWeight}`;
      break;
    case 'ukrainian':
      fontKey = `Inter-${fontWeight}`;
      break;
    case 'arabic':
      fontKey = `NotoSansArabic-${fontWeight}`;
      break;
    case 'bengali':
      fontKey = `NotoSansBengali-${fontWeight}`;
      break;
    case 'hindi':
      fontKey = `NotoSansDevanagari-${fontWeight}`;
      break;
    case 'thai':
      fontKey = `NotoSansThai-${fontWeight}`;
      break;
    case 'russian':
      fontKey = `Inter-${fontWeight}`;
      break;

    default:
      fontKey = `${fontFamily}-${fontWeight}`;
      break;
  }

  return fontKey.replaceAll('"', '');
};

// const generatePdf = async (
//   slides: ISlideGenerator[],
//   isPro?: boolean
// ): Promise<jsPDF> => {
//   const parentRect = {
//     width: 720,
//     height: 420,
//   };
//   const doc = new jsPDF({
//     orientation: "landscape",
//     unit: "pt",
//     format: [parentRect.width, parentRect.height],
//   });

//   let i = 0;

//   for (const slideData of slides) {
//     if (i > 0) doc.addPage();
//     i++;

//     doc.setFillColor(slideData.backgroundColor || "#FFFFFF");
//     doc.rect(0, 0, parentRect.width, parentRect.height, "F");
//     if (slideData.content) {
//       for (const contentItem of slideData.content) {
//         const x =
//           (parseFloat(contentItem.styles.x.replace("%", "")) / 100) *
//           parentRect.width;
//         const y =
//           (parseFloat(contentItem.styles.y.replace("%", "")) / 100) *
//           parentRect.height;
//         const width =
//           (parseFloat(contentItem.styles.width.replace("%", "")) / 100) *
//           parentRect.width;
//         const height =
//           (parseFloat(contentItem.styles.height.replace("%", "")) / 100) *
//           parentRect.height;

//         if (contentItem.singleItemType === "text") {
//           doc.setFontSize(parseFloat(contentItem.styles.fontSize));
//           doc.setFont(
//             "Helvetica",
//             +contentItem.styles.fontWeight >= 600 ? "bold" : "normal"
//           );
//           doc.setTextColor(contentItem.styles.color || "#000000");

//           if (slideData.slideType === "title") {
//             doc.text(
//               contentItem.content ?? "",
//               contentItem.styles.textAlign === "center" ? x + 300 : x,
//               y + 65,
//               {
//                 align:
//                   contentItem.styles.textAlign === "center" ? "center" : "left",
//                 maxWidth: width - 75,
//               }
//             );
//           } else {
//             doc.text(
//               contentItem.content ?? "",
//               contentItem.styles.textAlign === "center" && contentItem.content?.length !== 1 ? x + 300 : x,
//               y + 5,
//               {
//                 align:
//                   contentItem.styles.textAlign === "center" ? "center" : "left",
//                 maxWidth: width + 3,
//               }
//             );
//           }

//         }

//         if (contentItem.singleItemType === "image" && contentItem.content && !contentItem.content.includes('googleusercontent')){
//           const focusPoint = contentItem.styles.objectPosition
//             ?.replaceAll("%", "")
//             .split(" ");
//           const focusPointX = focusPoint?.[0] ? +focusPoint[0] : 50;
//           const focusPointY = focusPoint?.[1] ? +focusPoint[1] : 50;

//           const isLogo =
//             contentItem.content.includes("custom_logos") &&
//             contentItem.content.includes(".svg");

//           const img = await cropImageAsCanvas(
//             contentItem.content.includes("inabit")
//               ? `${contentItem.content}&X-Amz-Expires=7200`
//               : contentItem.content,
//             width / height,
//             focusPointX,
//             focusPointY
//           );
//           doc.addImage(img, isLogo ? "PNG" : "JPEG", x, y, width, height);
//         }

//         if (contentItem.singleItemType === "image" && contentItem.contentBlob) {
//           const img = contentItem.contentBlob;

//           doc.addImage(img, "PNG", x, y, width, height);
//         }

//         if (contentItem.singleItemType === "container" && contentItem.styles.backgroundColor) {
//           doc.setFillColor(contentItem.styles.backgroundColor || "#FFFFFF");
//           if (contentItem.styles.borderRadius > 0) {
//             doc.ellipse(x, y + 5, width / 2, height / 2, "F");
//           } else {
//             doc.rect(x, y, width, height, "F");
//           }
//         }
//       }

//       if (!isPro) {
//         const img = await cropImageAsCanvas(`${WATERMARK}`, 135 / 40, 50, 50);
//         doc.addImage(img, "PNG", 20, 380, 70, 22);
//         doc.link(20, 380, 70, 22, { url: "https://www.inabit.ai/" });
//       }
//     }
//   }

//   return doc;
// };

export const convertModelToPdf = async (
  title: string,
  container: HTMLDivElement,
  isPro: boolean,
  language: string = 'english',
): Promise<string> => {
  const doc = await generatePdf(container, isPro, language);
  doc.save(`${title}.pdf`);
  return `${title}.pdf conversion completed successfully`;
};

export const convertModelToPdfForPrint = async (
  container: HTMLDivElement,
  isPro: boolean,
  language: string = 'english',
): Promise<string> => {
  const doc = await generatePdf(container, isPro, language);
  doc.autoPrint();
  return doc.output('datauristring');
};

export const convertModelToPptx = async (
  slides: ISlideGenerator[],
  authorName: string,
  fontFace: string,
  title: string,
  presentationSlides?: ISlide[],
  showAgenda?: boolean,
  isPro?: boolean,
): Promise<string> => {
  // Initialize PptxGenJS
  const pptx = new pptxgen();
  pptx.author = authorName;
  pptx.theme = { headFontFace: fontFace, bodyFontFace: fontFace };

  slides.forEach((slideData, index) => {
    // Add a new slide
    const slide = pptx.addSlide();
    slide.background = {
      path: slideData.backgroundImage ?? '',
      color: slideData.backgroundColor ?? '',
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let actualSlide: any;

    if (presentationSlides) {
      actualSlide = showAgenda ? presentationSlides[index] : presentationSlides[index + 1];
    }
    // Iterate over content in the slide
    let tableTitle = true;
    slideData.content?.forEach((contentItem) => {
      let widthNumber: string;
      let xPos: string;

      if (parseFloat(contentItem?.styles?.width.replace('%', '')) <= 98) {
        widthNumber = parseFloat(contentItem?.styles?.width?.replace('%', '')) + 3 + '%';
        xPos = parseFloat(contentItem?.styles?.x?.replace('%', '')) - 1 + '%';
      } else {
        widthNumber = contentItem?.styles?.width;
        xPos = contentItem?.styles?.x;
      }

      // Add content based on the singleItemType
      if (contentItem.singleItemType === 'text' && !actualSlide.tableData) {
        slide.addText(contentItem.content!, {
          x: (xPos as pptxgen.Coord) ?? 0,
          y: (contentItem?.styles?.y as pptxgen.Coord) ?? 0,
          w: widthNumber as pptxgen.Coord,
          h: contentItem?.styles?.height as pptxgen.Coord,
          fontSize: contentItem?.styles?.fontSize ? +contentItem?.styles?.fontSize : 18,
          color: contentItem?.styles?.color,
          align: contentItem?.styles?.textAlign as pptxgen.HAlign,
          bold: +contentItem?.styles?.fontWeight >= 600,
        });
      } else if (contentItem.singleItemType === 'text' && actualSlide.tableData && tableTitle) {
        slide.addText(contentItem.content!, {
          x: (xPos as pptxgen.Coord) ?? 0,
          y: (contentItem?.styles?.y as pptxgen.Coord) ?? 0,
          w: widthNumber as pptxgen.Coord,
          h: contentItem?.styles?.height as pptxgen.Coord,
          fontSize: contentItem?.styles?.fontSize ? +contentItem?.styles?.fontSize : 18,
          color: contentItem?.styles?.color,
          align: contentItem?.styles?.textAlign as pptxgen.HAlign,
          bold: +contentItem?.styles?.fontWeight >= 600,
        });

        if (contentItem.content !== title) {
          tableTitle = false;
        }
      }

      if (
        !actualSlide?.chartData &&
        ((contentItem.singleItemType === 'image' &&
          contentItem?.content &&
          !contentItem.content.includes('googleusercontent')) ||
        contentItem.contentBlob)
      ) {
        const type =
          presentationSlides && presentationSlides[index + 1]?.imageFit === 'contain'
            ? 'contain'
            : 'cover';

        const path =
          contentItem.contentBlob ||
          (contentItem?.content?.includes('inabit')
            ? `${contentItem.content}&X-Amz-Expires=7200`
            : contentItem?.content);
        
        let x = contentItem?.styles?.x ?? 0;
        let y = contentItem?.styles?.y ?? 0;
        let width = contentItem?.styles?.width ?? 0;
        let height = contentItem?.styles?.height ?? 0;
        
        if (contentItem.contentBlob?.startsWith('data')) {
          width = parseFloat(width) / 3 + "%";
          height = parseFloat(height) / 3 + "%";
          x = '1%'
          y = '94%'
        }

        slide.addImage({
          path,
          x: (x as pptxgen.Coord) ?? 0,
          y: (y as pptxgen.Coord) ?? 0,
          sizing: {
            type: type,
            w: (width as pptxgen.Coord) ?? 0,
            h: (height as pptxgen.Coord) ?? 0,
          },
        });
      }

      if (
        contentItem.singleItemType === 'image' &&
        contentItem?.contentBlob &&
        presentationSlides
      ) {
        const actualSlide = showAgenda ? presentationSlides[index] : presentationSlides[index + 1];

        if (actualSlide) {
          const chartData = actualSlide.chartData;
          const chartType = actualSlide.chartType;

          if (chartData && chartData?.[0]?.length && chartType) {
            const labels: string[] = [];
            const seriesMap: Record<string, number[]> = {};

            chartData.forEach((cd) => {
              if (Array.isArray(cd)) {
                cd.forEach((cd2) => {
                  if (!labels.includes(cd2.name)) {
                    labels.push(cd2.name);
                  }

                  Object.keys(cd2).forEach((key) => {
                    if (key.startsWith('value')) {
                      if (!seriesMap[key]) {
                        seriesMap[key] = [];
                      }
                      seriesMap[key].push(cd2[key as any]);
                    }
                  });
                });
              }
            });

            const dataForChart = Object.entries(seriesMap).map(([_, values], index) => ({
              name: `Series ${index + 1}`,
              labels,
              values,
            }));

            const x = +contentItem?.styles?.x.replace('%', '') / 10;
            const w = +contentItem?.styles?.width.replace('%', '') - 10 + '%';
            const y = +contentItem?.styles?.y.replace('%', '') / 10 - 1.5;

            slide.addChart(getChartTypeForPPTX(chartType), dataForChart, {
              x: (x as pptxgen.Coord) ?? 0,
              y: (y as pptxgen.Coord) ?? 0,
              w: (w as pptxgen.Coord) ?? 0,
              h: (contentItem?.styles?.height as pptxgen.Coord) ?? 0,
            });
          }
        }
      }

      if (contentItem.singleItemType === 'container') {
        let shape = 'rect' as pptxgen.SHAPE_NAME;

        if (contentItem.containerType === 'arrow') {
          shape = 'chevron';
        } else if (contentItem?.styles?.borderRadius > 0) {
          shape = 'roundRect';
        }

        slide.addShape(shape, {
          x: contentItem?.styles?.x as pptxgen.Coord,
          y: contentItem?.styles?.y as pptxgen.Coord,
          w: contentItem?.styles?.width as pptxgen.Coord,
          h: contentItem?.styles?.height as pptxgen.Coord,
          align: contentItem?.styles?.textAlign as pptxgen.HAlign,
          fill:
            contentItem?.styles?.backgroundColor !== ''
              ? { color: contentItem?.styles?.backgroundColor }
              : undefined,
          rectRadius: contentItem?.styles?.borderRadius,
        });
      }
    });

    if (actualSlide?.tableData) {
      const themeElement = document.querySelector("[class*='theme-']");
      const computedStyle = getComputedStyle(themeElement as Element);

      const shapeColor = computedStyle.getPropertyValue('--shape').trim();
      const shapeText = computedStyle.getPropertyValue('--shapeText').trim();
      const headlineText = computedStyle.getPropertyValue('--headline').trim();
      const tableBorder = computedStyle.getPropertyValue('--tableBorder').trim();

      const styledTableData = actualSlide.tableData.map((row: string[], rowIndex: number) => {
        return row.map((cellText, colIndex) => {
          const isHeaderRow = !rowIndex;
          const isHeaderCol = !colIndex && actualSlide.variation === 'default';
          const isTopLeft = isHeaderRow && isHeaderCol;

          return {
            text: !isTopLeft && cellText,
            options: {
              fill: (isHeaderRow || isHeaderCol) && !isTopLeft && { color: shapeColor },
              bold: (isHeaderRow || isHeaderCol) && !isTopLeft,
              color: isHeaderRow && !isTopLeft && headlineText,
              border: !isTopLeft && { pt: 1, color: tableBorder },
            },
          };
        });
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      slide.addTable(styledTableData as any, {
        color: shapeText,
        fontFace: fontFace,
        fontSize: 12,
        margin: 4,
        valign: 'middle',
        x: '5%',
        y: '25%',
        w: '90%',
        h: '65%',
      });
    }

    if (!isPro) {
      slide.addShape('rect', {
        fill: { color: '#FFFFFF', transparency: 100 },
        x: '2%',
        y: '90%',
        w: 1,
        h: 0.5,
        hyperlink: { url: 'https://www.inabit.ai/' },
      });
    }
  });

  // Save the presentation
  await pptx.writeFile({ fileName: title });
  return `${title}.pptx conversion completed successfully`;
};

export const convertDomIntoModel = async (container: HTMLDivElement) => {
  const slidesObj: ISlideGenerator[] = [];

  if (container) {
    const slides = container.querySelectorAll("[class*='slide-container']:not(.skip)");
    const bgColor = window.getComputedStyle(slides?.[slides.length - 1])?.backgroundColor;
    let titleBgColor = bgColor;

    const titleSlide = container.querySelectorAll('.bg-titleBg');

    if (titleSlide && typeof titleSlide === typeof Element) {
      titleBgColor = window.getComputedStyle(titleSlide?.[0])?.backgroundColor;
    }

    let index = 0;

    const themedElements = document.querySelectorAll("[class*='theme-']");
    const backgroundImages = new Array(slides.length).fill(null);

    themedElements.forEach((el, i) => {
      if (i < slides.length) {
        const styles = window.getComputedStyle(el);
        const bgImage = styles.backgroundImage;

        if (bgImage && bgImage.startsWith('url')) {
          backgroundImages[i] = bgImage.slice(5, -2);
        }
      }
    });

    for (const slide of slides) {
      const parentRect = slide.getBoundingClientRect();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const allElements: any = slide.querySelectorAll('*');

      const widthCoof = 960 / parentRect.width;

      const elems: ISlideGeneratorElement[] = [];

      for (const el of allElements) {
        const rect = el.getBoundingClientRect();
        const tagName = el.tagName.toLowerCase();
        const styles = window.getComputedStyle(el);
        const className: string = typeof el.className === 'string' ? el.className : '';

        const leftPercent = ((rect.left - parentRect.left) / parentRect.width) * 100;
        const topPercent = ((rect.top - parentRect.top) / parentRect.height) * 100;
        const widthPercent = (rect.width / parentRect.width) * 100;
        const heightPercent = (rect.height / parentRect.height) * 100;

        const stylesObj: ISlideGeneratorStyles = {
          position: 'absolute',
          x: `${className?.includes('arrow-text') ? leftPercent + 4 : leftPercent}%`,
          y: `${topPercent}%`,
          width: `${className?.includes('arrow-shape') ? widthPercent + 2 : widthPercent}%`,
          height: `${heightPercent}%`,
          textAlign: `${styles.textAlign}`,
          backgroundColor:
            styles.backgroundColor !== 'rgba(0, 0, 0, 0)'
              ? `${rgbToHex(styles.backgroundColor)}`
              : '',
          borderRadius: +styles.borderRadius.replace('px', '') > 100 ? 1 : 0,
          fontSize: Math.round(
            pixelsToPoints(+styles.fontSize.replace('px', '')) * widthCoof - 1,
          ).toString(),
          fontSizePx: styles.fontSize,
          fontWeight: styles.fontWeight,
          z: styles.zIndex,
          fontFamily: styles.fontFamily,
          objectPosition: styles.objectPosition,
          color: styles.color !== 'rgba(0, 0, 0, 0)' ? `${rgbToHex(styles.color)}` : '',
        };

        if (!className?.includes('hidden') && !className?.includes('watermark')) {
          if (el.classList.contains('logo-watermark')) {
            stylesObj.width = `${widthPercent * 3}%`;
            stylesObj.height = `${heightPercent * 3}%`;
            stylesObj.x = `${leftPercent - 2}%`;
          }
          if (className?.includes('chart-legend-container')) {
            const colorBox = el.querySelector("div[class*='rounded-md']");
            const legendText = el.querySelector('span');

            if (colorBox && legendText) {
              const colorStyles = window.getComputedStyle(colorBox);
              const chartColor = rgbToHex(colorStyles.backgroundColor) || '';
              elems.push({
                layoutType: 'singleItem',
                singleItemType: 'container',
                styles: {
                  ...stylesObj,
                  width: '1.5%',
                  height: '1.5%',
                  backgroundColor: chartColor,
                },
              });

              elems.push({
                layoutType: 'singleItem',
                singleItemType: 'text',
                content: legendText.textContent || '',
                styles: {
                  ...stylesObj,
                  x: `${leftPercent + 2}%`,
                  width: `${widthPercent - 2}%`,
                },
              });
            }
          } else if (tagName === 'p' || tagName === 'img' || tagName === 'textarea') {
            elems.push({
              layoutType: 'singleItem',
              singleItemType:
                tagName === 'p' || tagName === 'textarea' || tagName.includes('h')
                  ? 'text'
                  : 'image',
              content:
                tagName === 'p' || tagName === 'textarea' || tagName.includes('h')
                  ? el.textContent
                  : el.src,
              styles: stylesObj,
            });
          } else if (
            (tagName === 'div' &&
              (className?.includes('bulletPoint') ||
                className?.includes('card-like-list') ||
                className?.includes('arrow-shape'))) ||
            className?.includes('free-slide-text')
          ) {
            elems.push({
              layoutType: 'singleItem',
              singleItemType: 'container',
              styles: stylesObj,
              containerType: className?.includes('arrow-shape') ? 'arrow' : 'plain',
            });
          } else if (tagName === 'div' && className?.includes('free-slide-bg')) {
            const urlMatch = styles.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
            const backgroundUrl = urlMatch?.[1];
            elems.push({
              layoutType: 'singleItem',
              singleItemType: 'image',
              content: backgroundUrl,
              styles: stylesObj,
            });
          } else if (tagName === 'a' && className?.includes('card-like-list')) {
            elems.push({
              layoutType: 'singleItem',
              singleItemType: 'container',
              styles: stylesObj,
              containerType: 'plain',
            });
          } else if (tagName === 'svg' && !el.classList.contains('aiStar')) {
            const canvas: HTMLCanvasElement = await convertSvgToCanvas(el);
            const imgData = canvas.toDataURL('image/png');

            elems.push({
              layoutType: 'singleItem',
              singleItemType: 'image',
              contentBlob: imgData,
              styles: stylesObj,
            });
          }
        }
      }

      slidesObj.push({
        slideNumber: index + 1,
        content: elems,
        slideType: index === 0 ? 'title' : 'blank',
        backgroundColor: index === 0 ? rgbToHex(titleBgColor) : rgbToHex(bgColor),
        backgroundImage: backgroundImages[index],
      });

      index++;
    }
  }

  return slidesObj;
};

const convertSvgToCanvas = (svgElement: Element): Promise<HTMLCanvasElement> => {
  return new Promise((resolve, reject) => {
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      context?.drawImage(img, 0, 0);
      resolve(canvas);
    };
    img.onerror = (error) => {
      reject(error);
    };

    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
  });
};

const readFileData = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = (e.target as FileReader).result;
      resolve(result);
    };
    reader.onerror = (err) => {
      reject(err);
    };
    reader.readAsDataURL(file);
  });
};

export const convertPdfToImages = async (file: File): Promise<HTMLCanvasElement[]> => {
  const images: HTMLCanvasElement[] = [];
  const data = await readFileData(file);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdf = await pdfjs.getDocument(data as any).promise;

  for (let i = 0; i < pdf.numPages; i++) {
    const page = await pdf.getPage(i + 1);
    const viewport = page.getViewport({ scale: 1 });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (context) {
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context, viewport: viewport }).promise;
      images.push(canvas);
    }
  }

  return images;
};

export const uploadConvertedImages = async (file: File, signal?: AbortSignal) => {
  const canvases = await convertPdfToImages(file);
  const imageUrls = [];

  for (let i = 0; i < canvases.length; i++) {
    const canvas = canvases[i];

    const imageDataUrl = canvas.toDataURL('image/png');

    const byteCharacters = atob(imageDataUrl.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let j = 0; j < byteCharacters.length; j++) {
      byteNumbers[j] = byteCharacters.charCodeAt(j);
    }
    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], { type: 'image/png' });

    const file = new File([blob], `image.png`, {
      type: 'image/png',
      lastModified: Date.now(),
    });

    const uploadData = await PresentationService.getImageUploadUrl(
      'png',
      'image/png',
      ImagePurpose.CONVERTED_SLIDE,
      signal,
    );

    if (!uploadData) return;

    const { imageUrl, imageKey, putUrl } = uploadData;

    await PresentationService.uploadImage(putUrl, file, signal);

    imageUrls.push({ imageUrl, imageKey });
  }

  return imageUrls;
};

export const uploadPresentation = async (file: File, alias: string) => {
  const nameParts = file.name.split('.');
  const ext = nameParts.pop() || 'file';

  const { putUrl } = await PresentationService.getUploadS3UrlForPresentation(alias, ext, file.type);

  await ConverterService.uploadFileToS3(file, putUrl);
};

export const convertToPdf = async (file: File, signal?: AbortSignal) => {
  const convertedFiles = await convertFileTo(file, 'pdf', signal);
  return convertedFiles && convertedFiles[0];
};

export const convertToTxt = async (file: File) => {
  const convertedFiles = await convertFileTo(file, 'txt');
  return convertedFiles && convertedFiles[0];
};

export const convertToPng = async (file: File) => {
  const convertedFiles = await convertFileTo(file, 'png');
  return convertedFiles;
};

const convertFileTo = async (
  file: File,
  convertTo: 'pdf' | 'txt' | 'png',
  signal?: AbortSignal,
) => {
  const nameParts = file.name.split('.');
  const ext = nameParts.pop() || 'file';
  const name = nameParts.join('.');

  const uploadData = await ConverterService.getUploadS3UrlForFileToConvert(
    name,
    ext,
    file.type,
    signal,
  );

  if (uploadData) {
    const { inputFileKey, outputFolderKey, putUrl } = uploadData;

    await ConverterService.uploadFileToS3(file, putUrl, signal);

    const convertedData = await ConverterService.convertTo(
      inputFileKey,
      outputFolderKey,
      convertTo,
      signal,
    );
    if (convertedData) {
      const { convertedUrls, format } = convertedData;

      if (!convertedUrls || convertedUrls.length === 0) {
        console.error('No converted files returned from Lambda');
      }

      const files = await Promise.all(
        convertedUrls.map(async (url, index) => {
          const response = await fetch(url);
          const blob = await response.blob();

          const fileName = `file-${index + 1}.${format}`;
          return new File([blob], fileName, { type: blob.type });
        }),
      );

      return files;
    }
  }
};

function filterSlides(presentation: IPresentation) {
  const slides = presentation.slides;
  const filteredSlides: ISlide[] = [];

  for (let i = 0; i < slides.length; i++) {
    switch (slides[i].slideType) {
      case 'content-slide':
        if (!presentation.showAgenda) continue;
        filteredSlides.push(slides[i]);
        break;
      case 'closing-slide':
        if (!presentation.showTitle) continue;
        filteredSlides.push(slides[i]);
        break;
      default:
        filteredSlides.push(slides[i]);
        break;
    }
  }

  return filteredSlides;
}

async function generateAudioForSlides(
  presentation: IPresentation,
): Promise<{ audioBuffers: AudioBuffer[]; audioContext: AudioContext }> {
  const audioBuffers: AudioBuffer[] = [];

  const filteredSlides = filterSlides(presentation);

  const audioContext = new AudioContext();
  await audioContext.resume();

  for (let i = 0; i < filteredSlides.length; i++) {
    const slide = filteredSlides[i];

    try {
      const slideText = getTextFromSlide(slide);

      const response = await ElevenLabsService.tts(slideText, '21m00Tcm4TlvDq8ikWAM', 'en');

      const uint8Array = new Uint8Array(response.data.data);
      const audioArrayBuffer = uint8Array.buffer;
      const audioBuffer = await audioContext.decodeAudioData(audioArrayBuffer);

      audioBuffers.push(audioBuffer);
    } catch (error) {
      console.error(`Failed to generate audio for slide ${i + 1}:`, error);
      const silentBuffer = audioContext.createBuffer(1, 44100, 44100);
      audioBuffers.push(silentBuffer);
    }
  }

  return { audioBuffers, audioContext };
}

const getChartTypeForPPTX = (type: string) => {
  switch (type) {
    case 'line-graph':
      return 'line';
    case 'bar-graph':
      return 'bar';
    case 'pie-chart':
      return 'pie';
    case 'donut-chart':
      return 'doughnut';
    default:
      return 'bar';
  }
};
export const convertModelToVideo = async (
  container: HTMLDivElement,
  isPro: boolean,
  withVoiceOver: boolean = false,
  presentation: IPresentation,
  language: string = 'english',
): Promise<string> => {
  try {
    const pdfDoc = await generatePdf(container, isPro, language);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas context not available');
    }

    canvas.width = 3840;
    canvas.height = 2160;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const pdfPages = await pdfjs.getDocument(pdfDoc.output('datauristring')).promise;
    const slideImages: HTMLImageElement[] = [];

    for (let i = 0; i < pdfPages.numPages; i++) {
      const page = await pdfPages.getPage(i + 1);

      const viewport = page.getViewport({ scale: 10.0 });

      const pageCanvas = document.createElement('canvas');
      const pageCtx = pageCanvas.getContext('2d');
      if (!pageCtx) continue;

      pageCanvas.width = viewport.width;
      pageCanvas.height = viewport.height;

      pageCtx.imageSmoothingEnabled = true;
      pageCtx.imageSmoothingQuality = 'high';

      await page.render({
        canvasContext: pageCtx,
        viewport: viewport,
      }).promise;

      const imageDataUrl = pageCanvas.toDataURL('image/png', 1.0);

      const img = new Image();
      img.src = imageDataUrl;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      slideImages.push(img);
    }

    if (withVoiceOver) {
      const { audioBuffers, audioContext } = await generateAudioForSlides(presentation);
      const result = await createVideoWithAudio(
        canvas,
        ctx,
        slideImages,
        audioBuffers,
        audioContext,
      );

      return result;
    }
    return await createVideoWithoutAudio(canvas, ctx, slideImages);
  } catch (error: any) {
    console.error('Error during video conversion:', error);
    throw new Error(`Video conversion failed: ${error?.message || String(error)}`);
  }
};

async function createVideoWithAudio(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  slideImages: HTMLImageElement[],
  audioBuffers: AudioBuffer[],
  audioContext: AudioContext,
): Promise<string> {
  const destination = audioContext.createMediaStreamDestination();

  const videoStream = canvas.captureStream(60);

  const combinedStream = new MediaStream([
    ...videoStream.getVideoTracks(),
    ...destination.stream.getAudioTracks(),
  ]);

  let mimeType = 'video/webm;codecs=vp9';
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    mimeType = 'video/webm;codecs=vp8';
  }
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    mimeType = 'video/webm';
  }

  const mediaRecorder = new MediaRecorder(combinedStream, {
    mimeType,
    videoBitsPerSecond: 50000000,
    audioBitsPerSecond: 320000,
  });

  const chunks: Blob[] = [];
  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      chunks.push(event.data);
    }
  };

  return new Promise((resolve, reject) => {
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `presentation-with-voice-${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);

      audioContext.close();
      resolve('Video with audio conversion completed successfully');
    };

    mediaRecorder.onerror = (error) => {
      console.error('MediaRecorder error:', error);
      audioContext.close();
      reject(new Error(`MediaRecorder error: ${error}`));
    };

    mediaRecorder.start(100);

    processSlidesWithMultipleAudio(
      ctx,
      canvas,
      slideImages,
      audioBuffers,
      audioContext,
      destination,
    )
      .then(() => {
        mediaRecorder.stop();
      })
      .catch((error: any) => {
        console.error('Error processing slides:', error);
        mediaRecorder.stop();
        reject(error);
      });
  });
}

async function processSlidesWithMultipleAudio(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  slideImages: HTMLImageElement[],
  audioBuffers: AudioBuffer[],
  audioContext: AudioContext,
  destination: MediaStreamAudioDestinationNode,
): Promise<void> {
  for (let i = 0; i < slideImages.length; i++) {
    const img = slideImages[i];
    const audioBuffer = audioBuffers[i];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;
    const x = (canvas.width - scaledWidth) / 2;
    const y = (canvas.height - scaledHeight) / 2;

    ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;

    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(1.0, audioContext.currentTime);

    source.connect(gainNode);
    gainNode.connect(destination);

    source.start(audioContext.currentTime);

    const slideDuration = audioBuffer.duration * 1000;

    await new Promise((resolve) => setTimeout(resolve, slideDuration));
  }
}

async function createVideoWithoutAudio(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  slideImages: HTMLImageElement[],
): Promise<string> {
  const stream = canvas.captureStream(60);

  let mimeType = 'video/mp4;codecs=h264';
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    mimeType = 'video/webm;codecs=vp9';
  }
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    mimeType = 'video/webm;codecs=vp8';
  }
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    mimeType = 'video/webm';
  }

  const mediaRecorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 50000000,
  });

  const chunks: Blob[] = [];
  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      chunks.push(event.data);
    }
  };

  return new Promise((resolve) => {
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `presentation-no-voice-${Date.now()}.${mimeType.includes('mp4') ? 'mp4' : 'webm'}`;
      a.click();
      URL.revokeObjectURL(url);
      resolve('Video without audio conversion completed successfully');
    };

    mediaRecorder.start();

    processSlideSequence(ctx, canvas, slideImages).then(() => {
      mediaRecorder.stop();
    });
  });
}

async function processSlideSequence(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  slideImages: HTMLImageElement[],
): Promise<void> {
  for (let i = 0; i < slideImages.length; i++) {
    const img = slideImages[i];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;
    const x = (canvas.width - scaledWidth) / 2;
    const y = (canvas.height - scaledHeight) / 2;

    ctx.save();
    ctx.translate(0.5, 0.5);
    ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
    ctx.restore();

    await new Promise((resolve) => setTimeout(resolve, 4000));
  }
}

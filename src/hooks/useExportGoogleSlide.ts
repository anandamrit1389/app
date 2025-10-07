/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';
import useInjectScript from './useScript';
import { pdfjs } from 'react-pdf';
import { IPresentation, ISlideGenerator } from '@/interfaces/ISlides';
import uploadImageAndGetUrl from '@/firebase/firebase.storage.utils';
import { cropImage } from '@/helpers/utils/image-crop';
import { toast } from 'sonner';
import { TableData } from '@/components/PresentationEditor/SlideFactory/Slides/SimpleTable';

pdfjs.GlobalWorkerOptions.workerSrc = '//unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs';

const SLIDE_WIDTH_PT = 720;
const SLIDE_HEIGHT_PT = 405;
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

const SPACING_CONSTANTS = {
  TEXT_PADDING: 5,
  IMAGE_MARGIN: 2,
  SHAPE_PADDING: 0,
  MIN_HEIGHT: 1,
  WIDTH_COMPENSATION: 0,
};

interface GoogleOAuthError {
  type: string;
  message?: string;
}

export default function useExportGoogleSlide(): {
  authResult: authResult | undefined;
  upload: (
    title: string,
    model: ISlideGenerator[],
    presentation: IPresentation,
    isPro?: boolean,
  ) => Promise<any>;
} {
  const defaultScopes = [SCOPES];
  const [loaded, error] = useInjectScript('https://apis.google.com/js/api.js');
  const [loadedGsi, errorGsi] = useInjectScript('https://accounts.google.com/gsi/client');
  const authRes = useRef<authResult>();

  useEffect(() => {
    if (loaded && !error && loadedGsi && !errorGsi) {
      loadApis();
    }
  }, [loaded, error, loadedGsi, errorGsi]);

  const upload = async (
    title: string,
    slides: ISlideGenerator[],
    presentation: IPresentation,
    isPro?: boolean,
  ) => {
    if (!authRes.current) {
      const tokenPromise = new Promise<authResult>((resolve, reject) => {
        const client = google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: defaultScopes.join(' '),
          callback: (tokenResponse: authResult) => {
            if (tokenResponse) {
              resolve(tokenResponse);
            } else {
              reject(new Error('Failed to get token'));
            }
          },
          error_callback: (error: GoogleOAuthError) => {
            reject(new Error(`Google authorization failed: ${error.type}`));
          },
        });

        client.requestAccessToken();
      });

      try {
        authRes.current = await tokenPromise;
        return await uploadPresentation(title, slides, presentation, isPro);
      } catch (error) {
        console.error('Error uploading presentation:', error);
        throw error;
      }
    } else {
      return await uploadPresentation(title, slides, presentation, isPro);
    }
  };

  const loadApis = () => {
    window.gapi.load('auth');
    window.gapi.load('client');
  };

  const uploadPresentation = async (
    title: string,
    slides: ISlideGenerator[],
    presentation: IPresentation,
    isPro?: boolean,
  ): Promise<{ message: string; id?: string }> => {
    await gapi.client.load('https://slides.googleapis.com/$discovery/rest?version=v1');
    const response = await gapi.client.slides.presentations.create({
      resource: {
        title: title ?? 'presentation',
        pageSize: {
          width: {
            magnitude: SLIDE_WIDTH_PT,
            unit: 'PT',
          },
          height: {
            magnitude: SLIDE_HEIGHT_PT,
            unit: 'PT',
          },
        },
      },
    });
    const presentationId = response.result.presentationId;
    return await exportToGoogleSlides(title, presentationId, slides, presentation, isPro);
  };

  const convertPercentageToPoints = (
    percentage: number,
    total: number,
    elementType: 'text' | 'image' | 'shape',
  ) => {
    const points = (percentage / 100) * total;

    if (elementType === 'shape') {
      return points + SPACING_CONSTANTS.SHAPE_PADDING + SPACING_CONSTANTS.WIDTH_COMPENSATION;
    }
    return points;
  };

  const exportToGoogleSlides = async (
    title: string,
    presentationId: string,
    slides: ISlideGenerator[],
    presentation: IPresentation,
    isPro?: boolean,
  ) => {
    console.log(isPro);
    for (let i = 0; i < slides.length; i++) {
      const slideData = slides[i];
      const actualSlide = presentation.showAgenda
        ? presentation.slides[i]
        : presentation.slides[i + 1];
      const slideId = await createSlide(
        presentationId,
        slideData.backgroundColor,
        slideData.backgroundImage,
      );
      const requests: any[] = [];
      let tableTitle = true;
      for (const contentItem of slideData.content) {
        const xPercent = parseFloat(contentItem.styles.x);
        const yPercent = parseFloat(contentItem.styles.y);
        const widthPercent = parseFloat(contentItem.styles.width);
        const heightPercent = parseFloat(contentItem.styles.height);

        const xPoints = convertPercentageToPoints(xPercent, SLIDE_WIDTH_PT, 'text');
        const yPoints = convertPercentageToPoints(yPercent, SLIDE_HEIGHT_PT, 'text');
        const widthPoints = convertPercentageToPoints(widthPercent, SLIDE_WIDTH_PT, 'shape');
        const heightPoints = convertPercentageToPoints(heightPercent, SLIDE_HEIGHT_PT, 'shape');
        const widthPointsImage = convertPercentageToPoints(widthPercent, SLIDE_WIDTH_PT, 'image');
        const heightPointsImage = convertPercentageToPoints(
          heightPercent,
          SLIDE_HEIGHT_PT,
          'image',
        );

        if (
          contentItem.singleItemType === 'text' &&
          contentItem.content &&
          !actualSlide.tableData
        ) {
          addTextRequest(
            requests,
            slideId,
            contentItem.content,
            xPoints,
            yPoints,
            widthPoints + 5,
            heightPoints === 0 ? 1 : heightPoints + 5,
            contentItem.styles.fontSize,
            contentItem.styles.fontFamily,
            contentItem.styles.fontWeight,
            contentItem.styles.color,
            contentItem.styles.textAlign,
          );
        } else if (
          contentItem.singleItemType === 'text' &&
          contentItem.content &&
          actualSlide.tableData &&
          tableTitle
        ) {
          addTextRequest(
            requests,
            slideId,
            contentItem.content,
            xPoints,
            yPoints,
            widthPoints + 5,
            heightPoints === 0 ? 1 : heightPoints + 5,
            contentItem.styles.fontSize,
            contentItem.styles.fontFamily,
            contentItem.styles.fontWeight,
            contentItem.styles.color,
            contentItem.styles.textAlign,
          );

          if (contentItem.content !== title) {
            tableTitle = false;
          }
        }

        if (contentItem.singleItemType === 'image' && contentItem.content) {
          const focusPoint = contentItem.styles.objectPosition?.replaceAll('%', '').split(' ');
          const focusPointX = focusPoint?.[0] ? +focusPoint[0] : 50;
          const focusPointY = focusPoint?.[1] ? +focusPoint[1] : 50;

          await addImageRequest(
            requests,
            slideId,
            contentItem.content,
            xPoints,
            yPoints,
            widthPointsImage,
            heightPointsImage === 0 ? 1 : heightPointsImage,
            focusPointX,
            focusPointY,
          );
        }

        if (contentItem.singleItemType === 'image' && contentItem.contentBlob) {
          const xPoints = convertPercentageToPoints(1, SLIDE_WIDTH_PT, 'text');
          const yPoints = convertPercentageToPoints(94, SLIDE_HEIGHT_PT, 'text');
          await addImageRequest(
            requests,
            slideId,
            contentItem.contentBlob,
            xPoints,
            yPoints,
            widthPointsImage / 3,
            heightPointsImage === 0 ? 1 : heightPointsImage / 3,
            50,
            50,
          );
        }

        if (contentItem.singleItemType === 'container') {
          addShapeRequest(
            requests,
            slideId,
            xPoints,
            yPoints,
            widthPoints,
            heightPoints === 0 ? 1 : heightPoints,
            contentItem.styles.backgroundColor,
            contentItem.styles.borderRadius,
            contentItem.containerType === 'arrow',
          );
        }
      }

      if (actualSlide.tableData) {
        addTableRequest(
          requests,
          slideId,
          actualSlide.tableData,
          actualSlide.variation,
          presentation.fontFamily,
        );
      }

      await gapi.client.slides.presentations.batchUpdate({
        presentationId,
        requests,
      });
    }

    await deleteSlide(presentationId, 'p');

    return { message: 'Google Slides export completed', id: presentationId };
  };

  const createSlide = async (
    presentationId: string,
    backgroundColor?: string | null,
    backgroundImage?: string | null,
  ) => {
    const response = await gapi.client.slides.presentations.batchUpdate({
      presentationId,
      requests: [
        {
          createSlide: {
            slideLayoutReference: {
              predefinedLayout: 'BLANK',
            },
          },
        },
      ],
    });
    const slideObjectId = response.result.replies[0].createSlide.objectId;

    if (backgroundImage) {
      const imageFile = await fetch(backgroundImage).then((res) => res.blob());
      const uploadedImageUrl = await uploadImageAndGetUrl(imageFile, `image-${Date.now()}`);
      await gapi.client.slides.presentations.batchUpdate({
        presentationId,
        requests: [
          {
            updatePageProperties: {
              objectId: slideObjectId,
              pageProperties: {
                pageBackgroundFill: {
                  stretchedPictureFill: {
                    contentUrl: uploadedImageUrl,
                  },
                },
              },
              fields: 'pageBackgroundFill',
            },
          },
        ],
      });
    } else if (backgroundColor) {
      await gapi.client.slides.presentations.batchUpdate({
        presentationId,
        requests: [
          {
            updatePageProperties: {
              objectId: slideObjectId,
              pageProperties: {
                pageBackgroundFill: {
                  solidFill: {
                    color: {
                      rgbColor: hexToRgb(backgroundColor),
                    },
                  },
                },
              },
              fields: 'pageBackgroundFill',
            },
          },
        ],
      });
    }

    return slideObjectId;
  };

  const addTextRequest = (
    requests: any[],
    slideId: string,
    text: string,
    x: number,
    y: number,
    width: number,
    height: number,
    fontSize: string,
    fontFamily: string,
    fontWeight: string,
    color: string,
    textAlign: string,
  ) => {
    const PADDING_COMPENSATION = 10;

    const id = crypto.randomUUID();
    requests.push(
      {
        createShape: {
          objectId: id,
          shapeType: 'TEXT_BOX',
          elementProperties: {
            pageObjectId: slideId,
            size: {
              width: {
                magnitude: width + PADDING_COMPENSATION,
                unit: 'PT',
              },
              height: {
                magnitude: height + PADDING_COMPENSATION,
                unit: 'PT',
              },
            },
            transform: {
              scaleX: 1,
              scaleY: 1,
              translateX: x,
              translateY: y,
              unit: 'PT',
            },
          },
        },
      },
      {
        insertText: {
          objectId: id,
          insertionIndex: 0,
          text,
        },
      },
      {
        updateTextStyle: {
          objectId: id,
          style: {
            fontSize: {
              magnitude: fontSize,
              unit: 'PT',
            },
            fontFamily: fontFamily,
            bold: fontWeight === 'bold' || +fontWeight >= 600,
            foregroundColor: {
              opaqueColor: {
                rgbColor: {
                  red: parseInt(color.slice(1, 3), 16) / 255,
                  green: parseInt(color.slice(3, 5), 16) / 255,
                  blue: parseInt(color.slice(5, 7), 16) / 255,
                },
              },
            },
          },
          fields: 'fontSize,fontFamily,bold,foregroundColor',
        },
      },
      {
        updateParagraphStyle: {
          objectId: id,
          style: {
            alignment: convertAlignToSlides(textAlign),
          },
          fields: 'alignment',
        },
      },
    );
  };

  const addImageRequest = async (
    requests: any[],
    slideId: string,
    imageUrl: string,
    x: number,
    y: number,
    width: number,
    height: number,
    focusPointX: number,
    focusPointY: number,
    objectId?: string,
  ) => {
    try {
      let url = imageUrl;

      if (url.includes('googleusercontent')) {
        return;
      }

      if (url.includes('https://')) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        if (blob.type.includes('svg')) {
          return;
        }

        const image = await cropImage(`${imageUrl}`, width / height, focusPointX, focusPointY);
        url = await uploadImageAndGetUrl(image, `image-${Date.now()}`);
      } else {
        const response = await fetch(`${imageUrl}`);
        const blob = await response.blob();
        url = await uploadImageAndGetUrl(blob, `${Date.now()}`);
      }

      requests.push({
        createImage: {
          objectId: objectId ? objectId : crypto.randomUUID(),
          elementProperties: {
            pageObjectId: slideId,
            size: {
              height: { magnitude: height, unit: 'PT' },
              width: { magnitude: width, unit: 'PT' },
            },
            transform: {
              scaleX: 1,
              scaleY: 1,
              translateX: x,
              translateY: y,
              unit: 'PT',
            },
          },
          url: url,
        },
      });
    } catch {
      toast('Image uploading issue');
    }
  };

  const addShapeRequest = (
    requests: any[],
    slideId: string,
    x: number,
    y: number,
    width: number,
    height: number,
    backgroundColor: string,
    borderRadius: number,
    isArrow?: boolean,
  ) => {
    if (!backgroundColor) return;
    let shapeType = 'RECTANGLE';

    if (isArrow) {
      shapeType = 'CHEVRON';
    } else if (borderRadius > 0) {
      shapeType = 'ELLIPSE';
    }

    const id = crypto.randomUUID();

    requests.push({
      createShape: {
        objectId: id,
        shapeType: shapeType,
        elementProperties: {
          pageObjectId: slideId,
          size: {
            height: { magnitude: height, unit: 'PT' },
            width: { magnitude: width, unit: 'PT' },
          },
          transform: {
            scaleX: 1,
            scaleY: 1,
            translateX: x + 7.5,
            translateY: y + 5,
            unit: 'PT',
          },
        },
      },
    });

    if (backgroundColor) {
      requests.push({
        updateShapeProperties: {
          objectId: id,
          fields: 'shapeBackgroundFill.solidFill.color, outline.outlineFill.solidFill',
          shapeProperties: {
            shapeBackgroundFill: {
              solidFill: {
                color: {
                  rgbColor: hexToRgb(backgroundColor),
                },
              },
            },
            outline: {
              outlineFill: {
                solidFill: {
                  alpha: 0,
                },
              },
            },
          },
        },
      });
    }
  };

  const addTableRequest = (
    requests: any[],
    slideId: string,
    tableData: TableData[],
    variation: string,
    fontFamily: string,
  ) => {
    const themeElement = document.querySelector("[class*='theme-']");

    const computedStyle = getComputedStyle(themeElement as Element);

    const shapeColor = computedStyle.getPropertyValue('--shape').trim();
    const shapeText = computedStyle.getPropertyValue('--shapeText').trim();
    const headlineColor = computedStyle.getPropertyValue('--headline').trim();
    const shapeStroke = computedStyle.getPropertyValue('--tableBorder').trim();

    const newTableData = tableData.map((row: string[], index: number) => {
      const newRow = [...row];
      if (variation === 'default' && !index) {
        newRow[0] = '';
      }

      return newRow;
    });

    const rows = newTableData.length;
    const columns = newTableData[0].length || 0;
    const id = crypto.randomUUID();

    requests.push({
      createTable: {
        objectId: id,
        elementProperties: {
          pageObjectId: slideId,
          size: {
            width: { magnitude: 650, unit: 'PT' },
            height: { magnitude: 280, unit: 'PT' },
          },
          transform: {
            scaleX: 1,
            scaleY: 1,
            translateY: 100,
            translateX: (SLIDE_WIDTH_PT - 650) / 2,
            unit: 'PT',
          },
        },
        rows: rows,
        columns: columns,
      },
    });

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const text = newTableData[row][col];
        const cellLocation = {
          rowIndex: row,
          columnIndex: col,
        };

        requests.push({
          insertText: {
            objectId: id,
            cellLocation: cellLocation,
            text: text,
          },
        });

        if (!row && !col && variation === 'default') {
          requests.push({
            updateTableBorderProperties: {
              objectId: id,
              tableRange: {
                location: {
                  rowIndex: row,
                  columnIndex: col,
                },
                rowSpan: 1,
                columnSpan: 1,
              },
              tableBorderProperties: {
                tableBorderFill: {
                  solidFill: {
                    alpha: 0,
                  },
                },
              },
              fields: 'tableBorderFill.solidFill.alpha',
            },
          });
        }

        if (row + col > 0 || variation !== 'default')
          requests.push({
            updateTableBorderProperties: {
              objectId: id,
              tableRange: {
                location: {
                  rowIndex: row,
                  columnIndex: col,
                },
                rowSpan: 1,
                columnSpan: 1,
              },
              tableBorderProperties: {
                tableBorderFill: {
                  solidFill: {
                    color: {
                      rgbColor: hexToRgb(shapeStroke),
                    },
                  },
                },
              },
              fields: 'tableBorderFill.solidFill.color',
            },
          });

        requests.push({
          updateTableCellProperties: {
            objectId: id,
            tableRange: {
              location: { rowIndex: row, columnIndex: col },
              rowSpan: 1,
              columnSpan: 1,
            },
            tableCellProperties: {
              contentAlignment: 'MIDDLE',
            },
            fields: 'contentAlignment',
          },
        });

        if (text) {
          requests.push({
            updateTextStyle: {
              objectId: id,
              cellLocation: cellLocation,
              style: {
                foregroundColor: {
                  opaqueColor: {
                    rgbColor: hexToRgb(shapeText),
                  },
                },
                fontSize: { magnitude: 12, unit: 'PT' },
                fontFamily: fontFamily,
              },
              fields: 'foregroundColor,fontSize',
            },
          });
        }

        if ((!row && col) || (!col && row)) {
          requests.push({
            updateTableCellProperties: {
              objectId: id,
              tableRange: {
                location: {
                  rowIndex: variation === 'default' ? row : 0,
                  columnIndex: col,
                },
                rowSpan: 1,
                columnSpan: 1,
              },
              tableCellProperties: {
                tableCellBackgroundFill: {
                  solidFill: {
                    color: {
                      rgbColor: hexToRgb(shapeColor),
                    },
                  },
                },
              },
              fields: 'tableCellBackgroundFill.solidFill.color',
            },
          });

          if (text) {
            requests.push({
              updateTextStyle: {
                objectId: id,
                cellLocation,
                style: {
                  bold: true,
                  foregroundColor: {
                    opaqueColor: {
                      rgbColor: row ? hexToRgb(shapeText) : hexToRgb(headlineColor),
                    },
                  },
                },
                fields: 'foregroundColor,bold',
              },
            });
          }
        }
      }
    }
  };

  const convertAlignToSlides = (align: string): string => {
    switch (align.toLowerCase()) {
      case 'left':
        return 'START';
      case 'center':
        return 'CENTER';
      case 'right':
        return 'END';
      case 'justify':
        return 'JUSTIFIED';
      default:
        return 'START'; 
    }
  };

  const hexToRgb = (hex: string) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return { red: r / 255, green: g / 255, blue: b / 255 };
  };

  const deleteSlide = async (presentationId: string, slideId: string) => {
    const requests = [
      {
        deleteObject: {
          objectId: slideId,
        },
      },
    ];

    return await gapi.client.slides.presentations.batchUpdate({
      presentationId: presentationId,
      requests: requests,
    });
  };

  return {
    authResult: authRes.current,
    upload,
  };
}

type authResult = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  authuser: string;
  prompt: string;
};

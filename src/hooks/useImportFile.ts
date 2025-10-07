/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useRef, useState } from 'react';
import useInjectScript from './useScript';

import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { read as readXLSX, utils as XLSXutils } from 'xlsx';
import { pdfjs } from 'react-pdf';
import {
  GOOGLE_DOC_MIME,
  GOOGLE_SHEET_MIME,
  GOOGLE_SLIDE_MIME,
  IMAGES_MIME,
  MICROSOFT_DOC_MIME,
  MICROSOFT_SHEET_MIME,
  MICROSOFT_SLIDE_MIME,
  PDF_MIME,
} from '@/helpers/constants/mime-types.const';
import PresentationService from '@/api/presentationService';
import { ImagePurpose } from '@/interfaces/IPresentation';
import { toast } from 'sonner';
import chroma from 'chroma-js';
import {
  convertToPdf,
  uploadConvertedImages,
  uploadPresentation,
} from '@/helpers/utils/convertion';
import { PrettifyContext } from '@/contexts/Prettify.context';
import { extractColors } from 'extract-colors';
import { IPrettifyOutlineData } from '@/interfaces/ISlides';
import { useEnhancementFinalization } from './useEnhancementFinalization';

pdfjs.GlobalWorkerOptions.workerSrc = '//unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const SCOPES = 'https://www.googleapis.com/auth/drive.file';
const MAX_SLIDES_FOR_DEMO = 5;

export default function useImportFile(): {
  openPicker: (config: PickerConfiguration) => boolean | undefined;
  importFile: (id: string, mime: string, parseImages?: boolean, demo?: boolean, signal?: AbortSignal) => Promise<any>;
  importLocalFile: (file: File, skip?: boolean, demo?: boolean, signal?: AbortSignal) => Promise<any>;
  authResult: authResult | undefined;
} {
  const { setSlidesNumber } = useContext(PrettifyContext);
  const { setThumbnail } =
      useEnhancementFinalization();
  const defaultScopes = [SCOPES];
  const [loaded, error] = useInjectScript('https://apis.google.com/js/api.js');
  const [loadedGsi, errorGsi] = useInjectScript('https://accounts.google.com/gsi/client');
  const [pickerApiLoaded, setPickerApiLoaded] = useState(false);
  const [openAfterAuth, setOpenAfterAuth] = useState(false);
  const [config, setConfig] = useState<PickerConfiguration>(defaultConfiguration);
  const authRes = useRef<authResult>();

  let picker: any;

  // get the apis from googleapis
  useEffect(() => {
    if (loaded && !error && loadedGsi && !errorGsi && !pickerApiLoaded) {
      loadApis();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, error, loadedGsi, errorGsi, pickerApiLoaded]);

  // use effect to open picker after auth
  useEffect(() => {
    if (openAfterAuth && loaded && !error && loadedGsi && !errorGsi && pickerApiLoaded) {
      createPicker(config);
      setOpenAfterAuth(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openAfterAuth, loaded, error, loadedGsi, errorGsi, pickerApiLoaded]);

  // open the picker
  const openPicker = (config: PickerConfiguration) => {
    // global scope given conf
    setConfig(config);

    // if we didn't get token generate token.
    if (!config.token) {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: (config.customScopes
          ? [...defaultScopes, ...config.customScopes]
          : defaultScopes
        ).join(' '),
        callback: (tokenResponse: authResult) => {
          authRes.current = tokenResponse;
          createPicker({ ...config, token: tokenResponse.access_token });
        },
      });

      client.requestAccessToken();
    }

    // if we have token and everything is loaded open the picker
    if (config.token && loaded && !error && pickerApiLoaded) {
      return createPicker(config);
    }
  };

  // load the Drive picker api
  const loadApis = () => {
    window.gapi.load('auth');

    window.gapi.load('client');

    window.gapi.load('picker', { callback: onPickerApiLoad });
  };

  const onPickerApiLoad = () => {
    setPickerApiLoaded(true);
  };

  const createPicker = ({
    token,
    appId = CLIENT_ID,
    supportDrives = false,
    developerKey = API_KEY,
    viewId = 'DOCS',
    disabled,
    multiselect,
    setOrigin,
    showUploadView = false,
    showUploadFolders,
    setParentFolder = '',
    viewMimeTypes,
    customViews,
    locale = 'en',
    setIncludeFolders,
    setSelectFolderEnabled,
    disableDefaultView = false,
    callbackFunction,
  }: PickerConfiguration) => {
    if (disabled) return false;

    const view = new google.picker.DocsView(google.picker.ViewId[viewId]);
    if (viewMimeTypes) view.setMimeTypes(viewMimeTypes);
    if (setIncludeFolders) view.setIncludeFolders(true);
    if (setSelectFolderEnabled) view.setSelectFolderEnabled(true);

    const uploadView = new google.picker.DocsUploadView();
    if (viewMimeTypes) uploadView.setMimeTypes(viewMimeTypes);
    if (showUploadFolders) uploadView.setIncludeFolders(true);
    if (setParentFolder) uploadView.setParent(setParentFolder);
    if (setParentFolder) view.setParent(setParentFolder);

    picker = new google.picker.PickerBuilder()
      .setAppId(appId)
      .setOAuthToken(token)
      .setDeveloperKey(developerKey)
      .setLocale(locale)
      .setCallback(callbackFunction);

    if (setOrigin) {
      picker.setOrigin(setOrigin);
    }

    if (!disableDefaultView) {
      picker.addView(view);
    }

    if (customViews) {
      customViews.map((view) => picker.addView(view));
    }

    if (multiselect) {
      picker.enableFeature(google.picker.Feature.MULTISELECT_ENABLED);
    }

    if (showUploadView) picker.addView(uploadView);

    if (supportDrives) {
      picker.enableFeature(google.picker.Feature.SUPPORT_DRIVES);
    }

    picker.build().setVisible(true);

    return true;
  };

  //import from Google drive
  const importFile = async (id: string, mime: string, parseImages?: boolean, demo?: boolean, signal?: AbortSignal) => {
    if (mime === GOOGLE_SLIDE_MIME) {
      return await getPresentation(id, demo, signal);
    } else if (mime === GOOGLE_DOC_MIME) {
      return await getDocument(id);
    } else if (mime === GOOGLE_SHEET_MIME) {
      return await getSpreadsheet(id);
    } else if (mime === PDF_MIME) {
      return await getPDFFile(id, parseImages, demo, signal);
    } else if (mime === MICROSOFT_DOC_MIME) {
      return await getDocFile(id);
    } else if (mime === MICROSOFT_SLIDE_MIME) {
      return await getPresentationFile(id, demo, signal);
    } else if (IMAGES_MIME.includes(mime)) {
      return await downloadImage(id);
    } else if (mime === MICROSOFT_SHEET_MIME) {
      return await getExcelFile(id);
    }
  };

  const getPresentation = async (presentationId: string, demo?: boolean, signal?: AbortSignal) => {
    await gapi.client.load('https://slides.googleapis.com/$discovery/rest?version=v1');

    await gapi.client.slides.presentations.get({
      presentationId: presentationId,
      access_token: authRes?.current?.access_token,
    });

    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${presentationId}/export?mimeType=application/pdf`,
      {
        headers: {
          Authorization: `Bearer ${authRes?.current?.access_token}`,
        },
        signal
      },
    );

    const blob = await response.blob();
    const file = new File([blob], 'file.pdf', { type: 'application/pdf' });

    return await readPDFdata(await file.arrayBuffer(), true, file, demo);
  };

  const getDocument = async (presentationId: string) => {
    await gapi.client.load('https://docs.googleapis.com/$discovery/rest?version=v1');

    const res = await gapi.client.docs.documents.get({
      documentId: presentationId,
      access_token: authRes?.current?.access_token,
    });

    let result = res.result;

    if (res.status === 200) {
      result = result?.body?.content
        ?.map((item: any) =>
          item?.paragraph?.elements.map((elem: any) => elem?.textRun?.content).join(''),
        )
        .join('');
    }

    return result;
  };

  const getSpreadsheet = async (spreadsheetId: string) => {
    await gapi.client.load('https://sheets.googleapis.com/$discovery/rest?version=v4');

    try {
      const response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: 'A1:Z1000',
      });

      const rows = response.result.values;
      
      if (!rows || rows.length === 0) {
        throw new Error('No data found in the spreadsheet');
      }
      const jsonData = JSON.stringify(rows);
      return jsonData;
    } catch (error) {
      console.error('Error fetching Google Sheet:', error);
      throw error;
    }
  };

  const getPDFFile = async (fileId: string, parseImages?: boolean, demo?: boolean, signal?: AbortSignal) => {
    await gapi.client.load('https://www.googleapis.com/discovery/v1/apis/drive/v3/rest');

    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: {
        Authorization: `Bearer ${authRes?.current?.access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch file');
    }

    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const file = new File([blob], 'file.pdf', { type: 'application/pdf' });

    return await readPDFdata(arrayBuffer, parseImages, file, demo, signal);
  };

  const downloadImage = async (fileId: string) => {
    await gapi.client.load('https://www.googleapis.com/discovery/v1/apis/drive/v3/rest');

    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: {
        Authorization: `Bearer ${authRes?.current?.access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch file');
    }

    return await response.blob();
  };

  const getDocFile = async (fileId: string) => {
    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: {
        Authorization: `Bearer ${authRes?.current?.access_token}`,
      },
    });

    const blob = await response.blob();
    const text = await readDocxAsText(blob);
    return text;
  };

  const getPresentationFile = async (fileId: string, demo?: boolean, signal?: AbortSignal) => {
    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: {
        Authorization: `Bearer ${authRes?.current?.access_token}`,
      },
    });

    const blob = await response.blob();
    const file = new File([blob], 'file.pptx', {
      type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    });
    const pdfFile = await convertToPdf(file, signal);

    if (!pdfFile) return;

    return await readPDFdata(await pdfFile.arrayBuffer(), true, pdfFile, demo, signal);
  };

  const getExcelFile = async (fileId: string) => {
    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: {
        Authorization: `Bearer ${authRes?.current?.access_token}`,
      },
    });

    const blob = await response.blob();
    const text = await readExcelFile(blob);

    return text;
  };

  const importLocalFile = async (file: File, skipImages?: boolean, demo?: boolean, signal?: AbortSignal) => {
    if (file.type === PDF_MIME) {
      return await getPDFLocal(file, !skipImages, demo, signal);
    } else if (file.type === MICROSOFT_DOC_MIME) {
      return await getDocLocal(file);
    } else if (file.type === MICROSOFT_SHEET_MIME) {
      return await readExcelFile(file);
    }
  };

  const getPDFLocal = async (file: File, parseImages?: boolean, demo?: boolean, signal?: AbortSignal) => {
    return readPDFdata(await file.arrayBuffer(), parseImages, file, demo, signal);
  };

  const getDocLocal = async (file: File) => {
    return readDocxAsText(file);
  };

  const readDocxAsText = async (blob: Blob | File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content: any = e?.target?.result;
          const x = new PizZip(content);
          const doc = new Docxtemplater(x, {
            delimiters: {
              start: '12op1j2po1j2poj1po',
              end: 'op21j4po21jp4oj1op24j',
            },
          });
          const text = doc.getFullText();
          resolve(text);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsBinaryString(blob);
    });
  };

  const readExcelFile = (blob: File | Blob) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data: any = e?.target?.result;
          const workbook = readXLSX(data, { type: 'binary' });

          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const sheetData = XLSXutils.sheet_to_json(sheet, { header: 1 });
          const filteredData = sheetData
            .map((row: any) =>
              row.filter((cell: any) => cell !== null && cell !== undefined && cell !== ''),
            )
            .filter((r) => r.length > 0);

          resolve(JSON.stringify(filteredData));
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsBinaryString(blob);
    });
  };

  const getSlidesNum = (totalPages: number, demo?: boolean) => {
    if (!demo) {
      return totalPages;
    }

    if (totalPages > MAX_SLIDES_FOR_DEMO) {
      return MAX_SLIDES_FOR_DEMO;
    }

    return totalPages;
  };

  const readPDFdata = async (
    pdfFile: ArrayBuffer,
    parseImages?: boolean,
    file?: File,
    demo?: boolean,
    signal?: AbortSignal
  ) => {
    const loadingTask = pdfjs.getDocument(pdfFile);
    const pdf = await loadingTask.promise;
    const totalPages = pdf.numPages;

    const numPages = getSlidesNum(totalPages, demo);

    const base64Set = new Set();
    const duplicatedImages: any[] = [];

    setSlidesNumber(numPages);

    const extractedDataOutline: DataItemOutline[] = [];
    const extractedData: DataItem[] = [];
    const slideImages = file && (await uploadConvertedImages(file, signal));
    const allPageImages: any = [];

    if (demo && slideImages) {
      setThumbnail(slideImages[0]?.imageUrl);
    }

    if (numPages > 30) {
      toast.error(
        'The maximum number of slides allowed is 30. Please reduce your presentation to 30 slides or fewer and try again.',
      );
      return;
    }

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const texts = textContent.items?.map((t: any) => t.str);

      const operatorList = await page.getOperatorList();
      const pageImages: any = [];

      const combinedText = texts
        .reduce((acc, item) => {
          if (item === '') {
            return acc + '\n';
          } else {
            return acc + item + ' ';
          }
        }, '')
        .trim();

      for (let i = 0; i < operatorList.fnArray.length; i++) {
        const fn = operatorList.fnArray[i];
        const args = operatorList.argsArray[i];

        if (fn === pdfjs.OPS.paintImageXObject && parseImages) {
          const imagesData = await new Promise<any>((resolve) => {
            let isResolved = false;

            page.objs.get(args[0], (data: any) => {
              isResolved = true;
              resolve(data?.bitmap ?? null);
            });

            setTimeout(() => {
              if (!isResolved) {
                isResolved = true;
                resolve(null);
              }
            }, 300);
          });

          if (imagesData) {
            const { width, height } = imagesData;
            if (width < height * 4 && height < width * 4) {
              const { file, base64 } = await bitmapToFile(imagesData);

              if (!base64Set.has(base64)) {
                base64Set.add(base64);

                const checkColor = await checkColors(base64);
                checkColor && pageImages.push({ file, width, height });
              } else if (width >= 50 && height >= 50) {
                duplicatedImages.push({ file, width, height });
              }
            }
          }
        }
      }

      allPageImages.push(pageImages);

      extractedDataOutline.push({
        text: combinedText.split('\n'),
        slideImage: slideImages && slideImages[pageNum - 1],
        numberOfImages: pageImages.filter((image: any) => image.width >= 100 && image.height >= 100)
          .length,
      });

      extractedData.push({
        text: combinedText.split('\n'),
        images: [],
        slideImage: slideImages && slideImages[pageNum - 1],
      });
    }

    const colors = slideImages && (await extractColors(slideImages[1] ? slideImages[1]?.imageUrl : slideImages[0]?.imageUrl));
    const dominantColor = colors?.sort((a, b) => b.area - a.area);
    const isLightColor = dominantColor && chroma(dominantColor[0].hex).luminance() > 0.5;

    const theme = isLightColor ? 'light' : 'grey';

    const outlineText = JSON.stringify({
      slides: extractedDataOutline,
    });

    const allImages: any = [];
    const serverUploadPromises = allPageImages.map(async (pageFiles: any, index: number) => {
      const pageImages: any = [];
      try {
        for (let i = 0; i < pageFiles.length; i++) {
          const file = pageFiles[i].file;
          const { width, height } = pageFiles[i];
          if (width > 100 && height > 100) {
            const uploadData = await uploadImageToServer(file, signal);
            if (uploadData) {
              const { imageUrl, imageKey } = uploadData
              pageImages.push({ src: imageUrl, imageKey, width, height });
            }
          }
        }
        allImages[index] = pageImages;
      } catch (error) {
        return null;
      }
      return pageImages;
    });

    if (duplicatedImages[0]) {
      const uploadData = await uploadImageToServer(duplicatedImages[0].file, signal);
      if (uploadData) {
        const { imageUrl, imageKey } = uploadData;
        duplicatedImages[0] = {
          src: imageUrl,
          imageKey,
          width: duplicatedImages[0].width,
          height: duplicatedImages[0].height,
        };
      }
    }

    let outlinePromise;
    if (demo) {
      outlinePromise = PresentationService.pretiffyDemo(outlineText, theme, signal);
    } else {
      outlinePromise = PresentationService.pretiffyOutline(outlineText);
    }

    const response = await Promise.all([outlinePromise, ...serverUploadPromises]);

    if (!demo && file) {
      uploadPresentation(file, (response[0] as IPrettifyOutlineData).alias);
    }

    for (let i = 0; i < extractedData.length; i++) {
      extractedData[i].images = allImages[i];
    }

    return {
      text: JSON.stringify({
        slides: extractedData,
        logotype: duplicatedImages[0],
      }),
      response: response[0],
    };
  };

  const bitmapToFile = async (bitmap: ImageBitmap) => {
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;

    const context = canvas.getContext('2d');
    context?.drawImage(bitmap, 0, 0);

    const base64 = canvas.toDataURL('image/png');

    const blob: any = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    const file = new File([blob], 'image.png', {
      type: 'image/png',
      lastModified: Date.now(),
    });

    return { file, base64 };
  };

  const checkColors = async (base64: string) => {
    const colors = await extractColors(base64, {
      lightnessDistance: 1,
      saturationDistance: 0.1,
    });

    if (colors.length > 1) {
      const mainColor = colors.find((color) => color.area > 0.9);
      const isDarkColor = mainColor && chroma(mainColor.hex).luminance() < 0.1;

      if (!mainColor || (mainColor && !isDarkColor)) {
        return true;
      }
    }

    return false;
  };

  return {
    openPicker,
    importFile,
    importLocalFile,
    authResult: authRes.current,
  };
}

const uploadImageToServer = async (file: File, signal?: AbortSignal) => {
  const uploadData = await PresentationService.getImageUploadUrl(
    'png',
    'image/png',
    ImagePurpose.PRESENTATION_IMAGE,
    signal
  );
  
  if (uploadData) {
    const { imageUrl, imageKey, putUrl } = uploadData;
    await PresentationService.uploadImage(putUrl, file, signal);
    return { imageKey, imageUrl }
  }
};

export type CallbackDoc = {
  downloadUrl?: string;
  uploadState?: string;
  description: string;
  driveSuccess: boolean;
  embedUrl: string;
  iconUrl: string;
  id: string;
  isShared: boolean;
  lastEditedUtc: number;
  mimeType: string;
  name: string;
  rotation: number;
  rotationDegree: number;
  serviceId: string;
  sizeBytes: number;
  type: string;
  url: string;
};

export type PickerCallback = {
  action: string;
  docs: CallbackDoc[];
};

export type authResult = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  authuser: string;
  prompt: string;
};

type ViewIdOptions =
  | 'DOCS'
  | 'DOCS_IMAGES'
  | 'DOCS_IMAGES_AND_VIDEOS'
  | 'DOCS_VIDEOS'
  | 'DOCUMENTS'
  | 'DRAWINGS'
  | 'FOLDERS'
  | 'FORMS'
  | 'PDFS'
  | 'SPREADSHEETS'
  | 'PRESENTATIONS';

export type PickerConfiguration = {
  clientId?: string;
  developerKey?: string;
  viewId?: ViewIdOptions;
  viewMimeTypes?: string;
  setIncludeFolders?: boolean;
  setSelectFolderEnabled?: boolean;
  disableDefaultView?: boolean;
  token?: string;
  setOrigin?: string;
  multiselect?: boolean;
  disabled?: boolean;
  appId?: string;
  supportDrives?: boolean;
  showUploadView?: boolean;
  showUploadFolders?: boolean;
  setParentFolder?: string;

  customViews?: any[];
  locale?: string;
  customScopes?: string[];
  callbackFunction: (data: PickerCallback) => any;
};

export const defaultConfiguration: PickerConfiguration = {
  callbackFunction: () => {},
};

export interface DocData {
  title: string;
  content: string;
  isLocal?: boolean;
}

export type DataItem = {
  text: string[];
  images: { src: string; height: number; width: number; imageKey?: string }[];
  slideImage?: { imageUrl: string; imageKey: string };
};

export type DataItemOutline = {
  text: string[];
  slideImage?: { imageUrl: string; imageKey: string };
  numberOfImages?: number;
};

export type ProcessedData = {
  text: string[];
  images: string[];
};

export type Result = {
  uniqueItems: DataItem[];
  duplicatedImages: {
    src: string;
    height: number;
    width: number;
    imageKey?: string;
  }[];
};

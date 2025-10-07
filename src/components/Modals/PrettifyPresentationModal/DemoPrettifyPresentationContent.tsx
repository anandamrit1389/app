import { ChangeEvent, useContext, useRef, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import useImportFile, { PickerCallback } from '@/hooks/useImportFile';
import GoogleDrive from '@/assets/google-drive.svg?react';
import Prettify from '@/assets/prettify.svg?react';
import { Button } from '@/components/ui/button';
import {
  GOOGLE_SLIDE_MIME,
  MICROSOFT_SLIDE_MIME,
  PDF_MIME,
} from '@/helpers/constants/mime-types.const';
import { Trans, useTranslation } from 'react-i18next';
import { IPrettifyOutlineSlide, ISlide } from '@/interfaces/ISlides';
import AIPrompt from '@/assets/ai-stars-1.svg?react';
import PrettifyProgress from '@/pages/PrettifyPage/PrettifyProgress/PrettifyProgress';
import { convertToPdf } from '@/helpers/utils/convertion';
import { toast } from 'sonner';
import { PrettifyContext } from '@/contexts/Prettify.context';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { useEnhancementFinalization } from '@/hooks/useEnhancementFinalization';
import { analyticsService } from '@/helpers/services/AnalyticsService';

export interface DemoPrettifyOutlineResponse {
  slidesOutline: IPrettifyOutlineSlide[];
  registrationId: string;
}

interface DemoPrettifyPresentationModalProps {
  onOutlineSuccess: () => void;
  onSuccess: (prettifyOutline: ISlide[]) => void;
  onFileUpload?: (file: File) => void;
  loading: boolean;
  onLoading: (isLoading: boolean) => void;
}

const DemoPrettifyPresentationContent = ({
  onOutlineSuccess,
  onSuccess,
  onFileUpload,
  loading = false,
  onLoading,
}: DemoPrettifyPresentationModalProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const {
    setPrettifyOutline,
    setShowMiddleware,
    setFileDataText,
    slidesNumber,
    setSlidesNumber,
    setLanguage,
    setTitle
  } = useContext(PrettifyContext);

  const { handleRemoveEnhanceFile } = useEnhancementFinalization();

  const { openPicker, importFile, importLocalFile, authResult } = useImportFile();

  const { t } = useTranslation('translation');
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target?.files) {
      const file = e.target.files[0];
      handleImportLocalFile(file);

      if (onFileUpload) {
        onFileUpload(file);
      }
    }
  };

  const handleAbort = () => {
     if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      handleRemoveEnhanceFile();
      onLoading(false);
    }
  }

  const handleImportLocalFile = async (file: File) => {
    if (!file) return;

    setSlidesNumber(0);
    onLoading(true);
    analyticsService.landingPagePreviewStart();

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    
    const convertFile = file.type === MICROSOFT_SLIDE_MIME ? await convertToPdf(file) : file;
    const fileData = convertFile && await importLocalFile(convertFile, false, true, signal);

    if (fileData) {
      try {
        setFileDataText(fileData.text);
        const response = fileData.response;
        if (response) {
          setPrettifyOutline(response.outline);
          setLanguage(response.language);
          setTitle(response.title);
          setShowMiddleware(true);
          onOutlineSuccess();
          onSuccess(response.outline);
          analyticsService.landingPagePreviewFinished();
        }
      } catch {
        toast.error(t('failedImport'));
        onLoading(false);
      }
    }
    onLoading(false);
  };

  const handleOpenPicker = () => {
    openPicker({
      token: authResult?.access_token,
      viewMimeTypes: `${PDF_MIME},${MICROSOFT_SLIDE_MIME},${GOOGLE_SLIDE_MIME}`,
      callbackFunction: (data: PickerCallback) => {
        if (data.action === 'picked') {
          handleGetDocument(data);
        }
      },
    });
  };

  const handleGetDocument = async (data: PickerCallback) => {
    setSlidesNumber(0);
    onLoading(true);
    analyticsService.landingPagePreviewStart();

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const file = data.docs[0];
    const fileData = await importFile(file.id, file.mimeType, true, true, signal);
    if (fileData) {
      if (
        file.mimeType === PDF_MIME ||
        file.mimeType === GOOGLE_SLIDE_MIME ||
        file.mimeType === MICROSOFT_SLIDE_MIME
      ) {
        try {
          setFileDataText(fileData.text);
          const response = fileData.response;

          if (response) {
            setPrettifyOutline(response.outline);
            setLanguage(response.language);
            setTitle(response.title);
            setShowMiddleware(true);
            onOutlineSuccess();
            onSuccess(response.outline);
            analyticsService.landingPagePreviewFinished();
          }
        } catch {
          onLoading(false);
          toast.error(t('failedImport'));
        }
      }
    }
    onLoading(false);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!loading) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!loading) setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (loading) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleImportLocalFile(file);

      if (onFileUpload) {
        onFileUpload(file);
      }
    }
  };

  return (
    <div className="mt-4 flex w-full max-w-[480px] flex-col gap-2 rounded-2xl bg-white p-6 shadow-section-shadow">
      <div className="mb-4 flex flex-col items-center justify-center gap-2">
        <AIPrompt />
        <h3 className="text-center text-[22px] font-semibold leading-none text-darkHeadline">
          {t('demoPreview.title')}
        </h3>
      </div>

      <div
        className={`p-10 transition-all ${
          loading ? 'outline-white' : 'outline-[#F1C3C3]'
        } relative flex flex-col items-center justify-center gap-2 rounded-lg ${
          isDragging ? 'bg-[#FFF0F0]' : 'bg-secondaryBg'
        } outline-dashed outline-2`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div
          className={`absolute z-0 flex size-full items-center justify-center rounded-lg transition-all ${
            loading ? 'bg-white' : 'bg-transparent'
          }`}
        >
          {loading && <PrettifyProgress slidesNumber={slidesNumber} hideCounter />}
        </div>
        <Prettify
          className={`z-20 mb-1 size-6 transition-all ${loading ? 'opacity-0' : 'opacity-100'}`}
        />
        <Input
          accept=".pdf, .pptx"
          id="picture"
          type="file"
          className={`absolute left-0 top-0 z-20 size-full cursor-pointer opacity-0 disabled:opacity-0`}
          onChange={handleFileUpload}
          disabled={loading}
        />
        <p
          className={`z-10 text-center text-[18px] font-semibold text-black transition-all ${
            loading ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <Trans i18nKey="presentation.">
            {t('demoPreview.dragAndDrop')}{' '}
            <span className="gradient-text cursor-pointer">{t('demoPreview.browse')}</span>
          </Trans>
        </p>
        <p
          className={`z-10 m-0 text-center text-grey transition-all ${
            loading ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {t('presentation.pptxPdf')}
        </p>
      </div>
      {loading ? ( 
        <div className="flex justify-center size-full">
          <BaseButton onClick={handleAbort}>
            {t('demoPreview.abort')}
          </BaseButton>
        </div>
        ) : (
        <Button
          disabled={loading}
          className={`flex h-16 cursor-pointer items-center justify-between rounded-lg
            bg-lightGrey p-4 text-black transition-all hover:bg-lightGreyHover focus:bg-lightGreyPress ${
              loading ? 'opacity-25' : 'opacity-100'
            }`}
          onClick={handleOpenPicker}
        >
          <div className="flex items-center justify-start gap-4">
            <GoogleDrive className="size-8" />
            <div className="">
              <p className="font-semibold">{t('presentation.googleDriveImport')}</p>
              <p className="text-start text-[14px]">{t('presentation.slideDocs')}</p>
            </div>
          </div>
          <ChevronRight />
        </Button>
      )}
    </div>
  );
};

export default DemoPrettifyPresentationContent;

import { ChangeEvent, ReactNode, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import Loader from '@/assets/loader-color.svg?react';
import GoogleDrive from '@/assets/google-drive.svg?react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import useImportFile, { PickerCallback } from '@/hooks/useImportFile';
import { IMAGES_MIME } from '@/helpers/constants/mime-types.const';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import ArrowBack from '@/assets/arrow-back.svg?react';
import { useTranslation } from 'react-i18next';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';

interface IProps {
  children?: ReactNode;
  open: boolean;
  title?: string;
  acceptedFormats: string;
  showPicker?: boolean;
  showPreview?: boolean;
  onClose?: () => void;
  onUpload: (file: File) => void;
  description?: string;
  mobile?: boolean;
  renderAsDiv?: boolean;
}

const UploadFileModal = ({
  open,
  onClose,
  onUpload,
  showPicker,
  showPreview,
  acceptedFormats,
  title,
  description,
  mobile,
  renderAsDiv,
}: IProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [tempUrl, setTempUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { t } = useTranslation('translation', { keyPrefix: 'modals' });

  const { openPicker, importFile, authResult } = useImportFile();

  const handleFile = (file: File) => {
    if (
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/gif' ||
      file.type === 'image/svg+xml' ||
      file.type === 'image/webp' ||
      file.type === 'image/avif'
    ) {
      setFile(file);
      setTempUrl(URL.createObjectURL(file));
    } else {
      toast.error(t('wrongFileFormat'));
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  };

  const handleOpenPicker = () => {
    onClose?.();
    openPicker({
      token: authResult?.access_token,
      viewMimeTypes: `${IMAGES_MIME}`,
      callbackFunction: async (data: PickerCallback) => {
        if (data.action === 'picked') {
          const doc = data.docs[0];
          const blob = await importFile(doc.id, doc.mimeType);

          if (blob) {
            const file = new File([blob], doc.name, { type: doc.mimeType });
            handleUpload(file);
          }
        }
      },
    });
  };

  const handleUpload = (fileToUpload?: File) => {
    setLoading(true);
    const f = fileToUpload ? fileToUpload : file;

    if (f) {
      onUpload(f);
    }

    setLoading(false);
    onClose?.();
    setFile(null);
    setTempUrl('');
  };

  const DrivePicker = () => {
    return (
      <Button
        disabled={loading}
        className={`flex h-16 w-full cursor-pointer items-center justify-between rounded-lg bg-lightGrey p-4 text-black transition-all hover:bg-grey ${
          loading ? 'opacity-25' : 'opacity-1'
        }`}
        onClick={handleOpenPicker}
      >
        <div className="flex items-center justify-start gap-4">
          <GoogleDrive className="size-8" />
          <div className="">
            <p className="font-semibold">{t('googleDriveImport')}/</p>
            <p className="text-start text-[14px]">{t('images')}</p>
          </div>
        </div>
        <ChevronRight />
      </Button>
    );
  };

  const FileLoader = () => {
    return (
      <div
        className={`absolute z-0 flex size-full items-center justify-center rounded-lg transition-all ${
          loading ? 'bg-white' : 'bg-transparent'
        }`}
      >
        <Loader
          className={`size-8 animate-spin transition-all ${loading ? 'opacity-1' : 'opacity-0'}`}
        />
      </div>
    );
  };

  const FileInput = () => {
    if (showPreview && tempUrl) {
      return <img src={tempUrl} className="max-h-40" />;
    } else {
      return (
        <div className="z-1">
          <p
            className={`transition-all ${
              loading ? 'opacity-0' : 'opacity-1'
            } z-20 text-center text-[18px] font-semibold text-black`}
          >
            Drag & drop or <span className="gradient-text cursor-pointer">{t('browse')}</span>
          </p>
          <p
            className={`transition-all ${
              loading ? 'opacity-0' : 'opacity-1'
            }  z-10 m-0 text-center text-grey`}
          >
            {file ? file.name : acceptedFormats}
          </p>
        </div>
      );
    }
  };
  if (renderAsDiv) {
    if (mobile) {
      return (
        <div className="flex w-full flex-col items-center justify-center gap-3 p-2">
          <div
            className={`w-full p-10 transition-all ${
              loading ? 'outline-white' : 'outline-[#F1C3C3]'
            } relative flex  flex-col items-center justify-center gap-2 rounded-lg bg-secondaryBg outline-dashed outline-2 outline-[#F1C3C3]`}
          >
            <FileLoader />
            <Input
              accept={acceptedFormats}
              id="picture"
              type="file"
              className={`absolute left-0 top-0 z-10 size-full cursor-pointer opacity-0`}
              onChange={handleFileUpload}
            />
            <FileInput />
          </div>
          {showPicker && <DrivePicker />}
          <div className="flex w-full justify-center gap-4">
            <BaseButton classNames="w-full" onClick={() => handleUpload()} disabled={!file}>
              {t('import')}
            </BaseButton>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-3" onDrop={handleDrop}>
        <div
          className={`p-10 transition-all ${
            loading ? 'outline-white' : 'outline-[#F1C3C3]'
          } relative flex  flex-col items-center justify-center gap-2 rounded-lg bg-secondaryBg outline-dashed outline-2 outline-[#F1C3C3]`}
        >
          <FileLoader />
          <Input
            accept={acceptedFormats}
            id="picture"
            type="file"
            className={`absolute left-0 top-0 z-10 size-full cursor-pointer opacity-0`}
            onChange={handleFileUpload}
          />
          <FileInput />
        </div>
        {showPicker && <DrivePicker />}
        <div className="flex w-full justify-start gap-4">
          <BaseButton classNames="w-full" onClick={() => handleUpload()} disabled={!file}>
            {t('upload')}
          </BaseButton>
        </div>
      </div>
    );
  }

  if (mobile) {
    return (
      <Sheet open={open} onOpenChange={() => onClose?.()}>
        <SheetContent hideclose="true" className="flex w-full flex-col items-center justify-center">
          <Button variant={'ghost'} className="absolute left-3 top-6" onClick={() => onClose?.()}>
            <ArrowBack />
          </Button>
          <SheetHeader className="mb-4">
            <SheetTitle className="text-center text-[24px] font-bold">
              {title ? title : t('uploadFile')}
            </SheetTitle>
            <p className="text-center text-tertiaryText">{description}</p>
          </SheetHeader>
          <div
            className={`w-full p-10 transition-all ${
              loading ? 'outline-white' : 'outline-[#F1C3C3]'
            } relative flex  flex-col items-center justify-center gap-2 rounded-lg bg-secondaryBg outline-dashed outline-2 outline-[#F1C3C3]`}
          >
            <FileLoader />
            <Input
              accept={acceptedFormats}
              id="picture"
              type="file"
              className={`absolute left-0 top-0 z-10 size-full cursor-pointer opacity-0`}
              onChange={handleFileUpload}
            />
            <FileInput />
          </div>
          {showPicker && <DrivePicker />}
          <div className="flex w-full justify-center gap-4">
            <BaseButton classNames="w-full" onClick={() => handleUpload()} disabled={!file}>
              {t('import')}
            </BaseButton>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={() => onClose?.()}>
      <DialogContent>
        <DialogHeader className="mb-4">
          <DialogTitle className="text-center text-[24px] font-bold">
            {title ? title : 'Upload file'}
          </DialogTitle>
          <p className="text-center text-tertiaryText">{description}</p>
        </DialogHeader>
        <div
          className={`p-10 transition-all ${
            loading ? 'outline-white' : 'outline-[#F1C3C3]'
          } relative flex  flex-col items-center justify-center gap-2 rounded-lg bg-secondaryBg outline-dashed outline-2 outline-[#F1C3C3]`}
        >
          <FileLoader />
          <Input
            accept={acceptedFormats}
            id="picture"
            type="file"
            className={`absolute left-0 top-0 z-10 size-full cursor-pointer opacity-0`}
            onChange={handleFileUpload}
          />
          <FileInput />
        </div>
        {showPicker && <DrivePicker />}
        <div className="flex w-full justify-center gap-4">
          <BaseButton variant="secondary" onClick={() => onClose?.()}>
            {t('close')}
          </BaseButton>
          <BaseButton onClick={() => handleUpload()} disabled={!file}>
            {t('upload')}
          </BaseButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadFileModal;

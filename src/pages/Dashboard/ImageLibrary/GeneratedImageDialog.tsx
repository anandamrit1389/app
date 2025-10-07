import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { Download } from 'lucide-react';
import AIStar from '@/assets/ai-star-black.svg?react';
import InfoCircleIcon from '@/assets/info-circle.svg?react';
import { GalleryImage } from '@/interfaces/images-gallery.interface';
import ShowInfoModal from '@/components/Modals/ShowInfoModal/ShowInfoModal';
import { useState, useRef, useEffect } from 'react';
import { analyticsService } from '@/helpers/services/AnalyticsService';
import Loader from '@/assets/loader-color.svg?react';

interface GeneratedImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  generatedImage: GalleryImage;
  onGenerateNew: (image: GalleryImage) => void;
  onDownload: (image: GalleryImage) => void;
  type: string;
}

const GeneratedImageDialog = ({
  open,
  onOpenChange,
  generatedImage,
  onGenerateNew,
  onDownload,
  type,
}: GeneratedImageDialogProps) => {
  const [showInfo, setShowInfo] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    setImageLoaded(false);
    
    if (imageRef.current?.complete && imageRef.current?.naturalWidth > 0) {
      setImageLoaded(true);
    }
  }, [open, generatedImage]);

  const { t } = useTranslation('translation', { keyPrefix: 'dashboard' });

  const handleShowInfo = () => {
    setShowInfo((prev) => !prev);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" flex h-dvh max-h-[95dvh] flex-col p-0 sm:grid sm:h-auto sm:w-[704px] sm:max-w-[80vw] sm:[&>button]:hidden">
        <DialogHeader className="flex h-[56px] flex-row items-center justify-center border-neutral-200 px-4 py-3 sm:h-auto sm:justify-between sm:border-b">
          <DialogTitle className="hidden">{t('title')}</DialogTitle>
          <div className="flex items-center gap-2 text-base font-bold text-cta-text-dark sm:text-sm sm:font-semibold">
            {type === 'ai' ? (
              t('aiGenerated')
            ) : (
              <>
                {t('uploads')}
                {type === 'web' && (
                  <BaseButton
                    classNames="p-0 hover:bg-transparent active:bg-transparent focus:bg-transparent"
                    variant="ghost"
                    onClick={handleShowInfo}
                    icon={<InfoCircleIcon />}
                    size="sm"
                  ></BaseButton>
                )}
              </>
            )}
          </div>
          <div className="!mt-0 hidden items-center gap-2 sm:flex">
            <BaseButton
              onClick={() => {
                analyticsService.myAssetsEditImage();
                onGenerateNew(generatedImage);
              }}
              variant="outline"
              classNames="h-10 px-3"
              icon={<AIStar className="size-5" />}
            >
              {t('editImage')}
            </BaseButton>
            <BaseButton
              onClick={() => {
                analyticsService.myAssetsDownloadImage();
                onDownload(generatedImage);
              }}
              variant="secondary"
              classNames="h-10 px-3"
              isDark
            >
              <Download className="size-5" />
              {t('download')}
            </BaseButton>
          </div>
        </DialogHeader>
        <div className="overflow-hidden rounded-lg px-[74px] pb-[45px] pt-6 sm:pt-4">
          <div className="relative w-full" style={{ paddingBottom: '75%' }}>
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <Loader className="animate-spin" />
              </div>
            )}
            <img
              ref={imageRef}
              src={generatedImage.imageUrl}
              alt={generatedImage.id.toString()}
              className="absolute inset-0 h-full w-full object-contain transition-opacity duration-300"
              style={{ opacity: imageLoaded ? 1 : 0 }}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        </div>
        <DialogFooter className="fixed inset-x-0 bottom-0 z-10 flex flex-row gap-2 bg-white p-4 sm:static sm:hidden sm:p-0">
          <BaseButton
            onClick={() => {
              analyticsService.myAssetsEditImage();
              onGenerateNew(generatedImage);
            }}
            variant="outline"
            classNames="h-10 px-3 w-full"
            icon={<AIStar className="size-5" />}
          >
            {t('generateNewImage')}
          </BaseButton>
          <BaseButton
            onClick={() => {
              analyticsService.myAssetsDownloadImage();
              onDownload(generatedImage);
            }}
            variant="secondary"
            classNames="h-10 px-3"
            isDark
          >
            <Download className="size-5" />
          </BaseButton>
          <ShowInfoModal
            isOpen={showInfo}
            onOpenChange={handleShowInfo}
            description={t('usageRights')}
            title={t('information')}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GeneratedImageDialog;

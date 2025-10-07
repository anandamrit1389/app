import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import AIStar from '@/assets/star-filled.svg?react';
import { cn } from '@/lib/utils';
import CreditCost from '@/components/CreditCost/CreditCost';
import { CreditAction } from '@/interfaces/IPricing';
import CoinFilledWhite from '@/assets/coin-filled-white.svg?react';
import { useCreditsCheck } from '@/hooks/useCreditsCheck';
import { analyticsService } from '@/helpers/services/AnalyticsService';
import Loader from '@/assets/loader-color.svg?react';
import { ITransformImage } from '@/interfaces/IUsePresentation';

interface GenerateNewImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (prompt: string, referenceImage: ITransformImage | null) => void;
  referenceImage: ITransformImage | null;
}

const ImageTransformModal = ({
  open,
  onOpenChange,
  onGenerate,
  referenceImage,
}: GenerateNewImageDialogProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });
  const [prompt, setPrompt] = useState('');
  const { hasEnoughCredits } = useCreditsCheck();
  const [referenceImageLoaded, setReferenceImageLoaded] = useState(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!open) {
      setPrompt('');
      setReferenceImageLoaded(false);
    }
  }, [open]);

  useEffect(() => {
    setReferenceImageLoaded(false);
    if (referenceImage && imageRef.current?.complete && imageRef.current?.naturalWidth > 0) {
      setReferenceImageLoaded(true);
    }
  }, [referenceImage]);

  const handleGenerate = async () => {
    if (!prompt.trim() || !referenceImage) return;
    
    if (hasEnoughCredits(CreditAction.REROLL_IMAGE)) {
      analyticsService.myAssetsCreateImage();
      if (onGenerate) {
        setIsGenerating(true);
        await onGenerate(prompt.trim(), referenceImage);
        onOpenChange(false);
        setIsGenerating(false);
      }
    }
  };

  if (!referenceImage) return;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex h-dvh flex-col p-6 pt-[56px] sm:grid sm:h-auto sm:w-[704px] sm:pt-6"
        hideclose={isGenerating}
      >
        <DialogHeader>
          <DialogTitle className="flex flex-col items-center gap-2">
            <span>{t('adjustImage')}</span>
            {referenceImage && (
              <span className="text-sm font-normal text-text-tertiary">
                {t('transformDescription')}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-x-6 sm:flex-row">
          {referenceImage && (
            <div className="relative h-[130px] w-[112px] shrink-0 py-4 sm:py-0">
              <div className="relative h-full w-full overflow-hidden rounded-md">
                {!referenceImageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <Loader className="animate-spin" />
                  </div>
                )}
                <img
                  ref={imageRef}
                  src={referenceImage.imageUrl}
                  className="h-full w-full object-cover transition-opacity duration-300"
                  style={{ opacity: referenceImageLoaded ? 1 : 0 }}
                  onLoad={() => setReferenceImageLoaded(true)}
                />
              </div>
            </div>
          )}
          <Textarea
            id="imagePrompt"
            disabled={isGenerating}
            className={cn(
              'text-titleText/60 !mx-0 rounded-2xl border-4 border-[#F9F9FA] bg-transparent text-base font-normal',
              referenceImage
                ? 'h-[200px] mt-4 sm:mt-0 sm:h-[127px] max-w-[325px]'
                : 'h-[155px] max-w-[460px]',
            )}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t('enterImagePrompt')}
            maxLength={500}
          />
        </div>
        <DialogFooter className="fixed inset-x-0 bottom-0 z-10 bg-white p-4 sm:static sm:p-0">     
          <BaseButton
            type="submit"
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            loading={isGenerating}
            classNames="h-12"
            icon={<AIStar />}
          >
            {t('generateNewImage')}
            <CreditCost
              action={CreditAction.REROLL_IMAGE}
              icon={<CoinFilledWhite />}
              containerClassName={`border-l border-l-lightGrey/30`}
              costClassName={`text-lightGrey`}
            />
          </BaseButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageTransformModal;

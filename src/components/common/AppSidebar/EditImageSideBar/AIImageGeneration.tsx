import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from 'react-i18next';
import AIStar from '@/assets/star-filled.svg?react';
import { useContext, useState, useEffect, useRef } from 'react';
import { PresentationContext } from '@/contexts/Presentation.context';
import { toast } from 'sonner';
import SurpriseMe from './SurpriseMe';
import Coins2Icon from '@/assets/coins-2.svg?react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImageStyle } from '@/interfaces/images-styles.interface';
import { CreditAction } from '@/interfaces/IPricing';
import CreditCost from '@/components/CreditCost/CreditCost';
import { useSubscriptionModal } from '@/hooks/useSubscriptionModal';
import CoinFilledWhite from '@/assets/coin-filled-white.svg?react';
import { useAIImageStyles } from '@/hooks/useAIImageStyles';
import useMobile from '@/hooks/useMobile';
import { useCreditsCheck } from '@/hooks/useCreditsCheck';
import { useCredits } from '@/hooks/useCredits';

interface AIImageGenerationProps {
  sidebarContainerRef: React.RefObject<HTMLDivElement>;
}

const AIImageGeneration = ({ sidebarContainerRef }: AIImageGenerationProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });
  const isMobile = useMobile();

  const {
    presentation,
    activeImage,
    generateImage,
    currentSideBarType,
    setIsSideBarActive,
    setActiveImage,
  } = useContext(PresentationContext);

  const selectRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const { aiCompatibleStyles, selectedStyle, setSelectedStyle } = useAIImageStyles(
    presentation?.imageStyle,
  );
  const { onOpenCreditPacksChange } = useSubscriptionModal();
  const { hasEnoughCredits } = useCreditsCheck();
  const credits = useCredits();

  useEffect(() => {
    if (isMobile) return;

    const handleClickOutside = (event: MouseEvent) => {
      const isSelectClicked = selectRef.current?.contains(event.target as Node);
      const isImageClicked = event.target instanceof HTMLImageElement;
      const isSidebarClicked = sidebarContainerRef.current?.contains(event.target as Node);

      if (isSelectClicked || isImageClicked || isSidebarClicked) {
        return;
      }

      if (activeImage && currentSideBarType === 'webimages') {
        setIsSideBarActive(false);
        setActiveImage(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeImage]);

  const handleGenerateImage = async (prompt: string) => {
    if (!activeImage?.slideId) return toast.error(t('refreshImageError'));
    if (!prompt.trim()) return;

    if (hasEnoughCredits(CreditAction.REROLL_IMAGE)) {
      try {
        setLoading(true);
        await generateImage(prompt, activeImage.slideId, activeImage.contentId, selectedStyle);
        setPrompt('');
        toast.success(t('successMessageImageGenerated'));
      } catch (error) {
        console.error(error);
        toast.error(t('errorMessageImageGeneration'));
      } finally {
        setLoading(false);
      }
    }
  };

  const selectedImageStyle = aiCompatibleStyles.find((style: ImageStyle) => style.slug === selectedStyle)?.title;

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="text-[12px] font-medium uppercase">{t('aiImageGeneration')}</div>
      <div className="flex flex-col gap-2">
        <Select value={selectedStyle} onValueChange={setSelectedStyle}>
          <SelectTrigger className="w-full">
            <SelectValue>
              {(selectedStyle && (
                <div className="flex flex-row items-center gap-2">
                  <img
                    src={
                      aiCompatibleStyles.find((style: ImageStyle) => style.slug === selectedStyle)
                        ?.thumbSrc
                    }
                    alt={
                      aiCompatibleStyles.find((style: ImageStyle) => style.slug === selectedStyle)
                        ?.title
                    }
                    className="h-6 w-10 rounded-sm"
                  />
                  <span>
                    {
                      selectedImageStyle && t(selectedImageStyle)
                    }
                  </span>
                </div>
              )) ||
                'Select image style'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent ref={selectRef}>
            {aiCompatibleStyles.map((style: ImageStyle) => (
              <SelectItem key={style.id} value={style.slug} className="!pl-2">
                <div className="flex flex-row items-center gap-2">
                  <img src={style.thumbSrc} alt={style.title} className="h-6 w-10 rounded-sm" />
                  {style.slug === presentation?.imageStyle ? (
                    <div className="flex items-center gap-2">
                      <span>{t(style.title)}</span>
                      <span className=" text-[10px] leading-none bg-[#E8E8E8] p-1 font-medium">
                        {t('used')}
                      </span>
                    </div>
                  ) : (
                    <span>{t(style.title)}</span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative bg-lightGrey rounded-lg p-1">
          <Textarea
            placeholder="Describe your image and let our AI generate it for you"
            className="h-20 py-2 pl-3 pr-14 not-italic !focus-visible:ring-0 !focus-visible:ring-offset-0 !focus-visible:border-none"
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
            value={prompt}
          />
          <div className="flex flex-row w-full items-center justify-between">
            <SurpriseMe onSetPrompt={setPrompt} />
            <BaseButton
              variant="loading"
              loading={loading}
              onClick={() => handleGenerateImage(prompt)}
              disabled={!prompt}
              tooltip={t('generate')}
              classNames="[&>svg]:w-7 [&>svg]:h-7 !p-1 rounded-lg"
              tooltipClassNames="mb-4"
              icon={<AIStar />}
            >
              <span className="text-white text-sm">{t('generate')}</span>
              <CreditCost
                action={CreditAction.REROLL_IMAGE}
                icon={<CoinFilledWhite />}
                containerClassName={`border-l border-l-lightGrey/30`}
                costClassName={`text-lightGrey`}
              />
            </BaseButton>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <Coins2Icon className="size-6 text-disabled" />
          <span
            onClick={() => onOpenCreditPacksChange()}
            className="cursor-pointer text-xs text-disabled"
          >
            {credits} {t('creditsLeft')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AIImageGeneration;

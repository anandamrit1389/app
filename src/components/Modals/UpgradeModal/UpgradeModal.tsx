import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import Crown from '@/assets/pro-crown.svg?react';
import upgradeBanner from '@/assets/upgrade-modal-image.png';
import { useTranslation } from 'react-i18next';
interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpgradeClick: () => void;
}

const UpgradeModal = ({ open, onOpenChange, onUpgradeClick }: Props) => {
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="md:max-w-[760px] max-w-[90vw] border-0 bg-white p-0 overflow-hidden rounded-xl">
          <DialogTitle className="hidden">{t('title')}</DialogTitle>
          <img
            src={upgradeBanner}
            className="h-[160px] w-full bg-cover bg-center object-cover"
            alt={t('upgradeToPro')}
          />

          <button
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
            onClick={() => onOpenChange(false)}
          >
            <X className="size-4 text-white" />
          </button>

          <div className="md:p-6 p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-tertiaryText">
              {t('timeToUpgrade')}
            </h4>
            <h2 className="mt-2 text-[28px] font-bold text-eerieBlack md:text-[32px]">
              {t('needMoreSlides')}
            </h2>
            <p className="md:text-lg text-sm mt-3 text-darkText leading-relaxed">
              {t('youveHitMaxSlides')}
              <span className="font-semibold text-black"> {t('upgradeToPro')}</span>{' '}
              {t('unlockUnlimitedSlides')}
            </p>
            <div className="flex flex-wrap gap-2 items-center justify-end">
              <BaseButton
                variant="secondary"
                onClick={() => onOpenChange(false)}
                classNames="mt-6 text-darkText text-sm px-3 py-2"
              >
                {t('iLLDoItLater')}
              </BaseButton>
              <BaseButton
                onClick={onUpgradeClick}
                classNames="mt-6 bg-[var(--pro-badge-bg)] hover:bg-lightGold text-white text-sm px-3 py-2"
              >
                <Crown className="size-5 mr-0.5" /> {t('upgradeNow')}
              </BaseButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpgradeModal;

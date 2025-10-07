import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import InabitLogo from '@/assets/logo-inabit-color.svg?react';
import { useState } from 'react';

const UpgradeTeamDialog = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'team' });
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <BaseButton classNames="w-full bg-[#BD9E60] rounded-lg hover:bg-[#AB8D51] focus:bg-[#997D46] text-lightGrey text-[16px]">
          {t('upgradeBtn')}
        </BaseButton>
      </DialogTrigger>
      <DialogOverlay className="fixed inset-0 bg-black/80 z-[9999]" />
      <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg sm:w-[640px] sm:max-w-full z-[10000]">
        <DialogTitle className="hidden">{t('title')}</DialogTitle>
        <div className="pt-2">
          <InabitLogo width="71" height="65" className="mx-auto" />
          <h2 className="mb-4 text-center text-[32px] font-semibold">{t('upgradeDialogTitle')}</h2>
          <p className="mx-auto max-w-[412px] text-center text-base leading-6 text-text-tertiary">
            {t('upgradeDialogDescription')}
          </p>
        </div>
        <div className="mt-6 sm:justify-center flex justify-center">
          <a href="mailto:support@inabit.ai">
            <BaseButton size="lg">{t('upgradeDialogBtn')}</BaseButton>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeTeamDialog;

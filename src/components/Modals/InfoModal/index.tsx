import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { useTranslation } from 'react-i18next';

import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import useMobile from '@/hooks/useMobile';
import { useInfoModal } from '@/hooks/useInfoModal';

const InfoModal = () => {
  const isMobile = useMobile();
  const { t } = useTranslation('translation', {
    keyPrefix: 'info_modal',
  });

  const { open, onCloseDialog, modalData } = useInfoModal();

  const onOpenChange = () => {
    onCloseDialog();
  };

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="border-0 p-6">
          <SheetTitle className="mb-2 text-sm font-semibold uppercase text-tertiaryText">
            {t(modalData.headerKey)}
          </SheetTitle>
          <h2 className={`mb-2 w-full text-left text-subheadline font-semibold`}>
            {t(modalData.titleKey)}
          </h2>
          <h2 className="mb-2 w-full text-left text-base text-darkText">{t(modalData.bodyKey)}</h2>
          <div className="flex justify-end gap-2">
            <BaseButton
              type="button"
              classNames="text-white px-10 bg-[#111827] focus:bg-[#000000] hover:bg-[#374151] h-[48px] flex-1"
              onClick={onOpenChange}
            >
              {t('btn')}
            </BaseButton>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[760px] gap-0 border-0 p-6">
        <DialogTitle className="mb-3 text-sm font-semibold uppercase text-tertiaryText">
          {t(modalData.headerKey)}
        </DialogTitle>
        <h2 className={`mb-3 w-full text-left text-subheadline font-semibold`}>
          {t(modalData.titleKey)}
        </h2>
        <h2 className={`mb-3 w-full text-left text-base text-darkText`}>{t(modalData.bodyKey)}</h2>
        <div className="flex justify-end gap-2">
          <BaseButton
            type="button"
            classNames="text-white px-10 bg-[#111827] focus:bg-[#000000] hover:bg-[#374151] h-[40px]"
            onClick={onOpenChange}
          >
            {t('btn')}
          </BaseButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InfoModal;

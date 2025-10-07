import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import CloseIcon from '@/assets/close.svg?react';
import { useTranslation } from 'react-i18next';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';

interface PaymentSuccessModalProps {
  open: boolean;
  onClick: () => void;
}

function PaymentFailedModal({ open, onClick }: PaymentSuccessModalProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'subscription' });

  return (
    <Dialog open={open}>
      <DialogContent className="gap-6 sm:max-w-md [&>button:has(svg)]:hidden">
        <DialogHeader>
          <div className="mx-auto rounded-full bg-[#B12525] p-2">
            <CloseIcon />
          </div>
          <DialogTitle className="text-darkHeadlinetext-xl text-center font-bold md:text-2xl">
            {t('failedTitle')}
          </DialogTitle>
          <DialogDescription className="!mt-2 text-center text-base text-darkText">
            {t('failedDescription')}
          </DialogDescription>
        </DialogHeader>
        <BaseButton isDark variant="secondary" classNames="w-max mx-auto" onClick={onClick}>
          {t('failedLink')}
        </BaseButton>
        <p className="text-center text-xs text-darkText">
          {t('failedSupport')}{' '}
          <a className="text-redText" href={`mailto:support@inabit.ai`}>
            support@inabit.ai
          </a>
        </p>
      </DialogContent>
    </Dialog>
  );
}

export default PaymentFailedModal;

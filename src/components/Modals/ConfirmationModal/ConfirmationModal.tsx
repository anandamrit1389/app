import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import CreditCost from '@/components/CreditCost/CreditCost';
import { CreditAction } from '@/interfaces/IPricing';
import CoinFilledWhite from '@/assets/coin-filled-white.svg?react';
import { useTranslation } from 'react-i18next';

interface IProps {
  open: boolean;
  onOpenChange: () => void;
  onAction: (val: boolean) => void;
  creditAction: CreditAction;
}

const ConfirmationModal = ({ open, onOpenChange, onAction, creditAction }: IProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });

  return (
    <Dialog open={open} onOpenChange={() => onOpenChange()}>
      <DialogContent className={`gap-0 p-8 sm:max-w-md`}>
        <DialogTitle className="mb-2 text-center text-xl  font-bold text-darkHeadline">
          {t('confirmChangeLayoutTitle')}
        </DialogTitle>
        <DialogDescription className="mb-6 text-center text-base text-darkText">
          {t('confirmChangeLayoutDescription')}
        </DialogDescription>
        <div className="flex gap-4">
          <BaseButton
            onClick={() => {
              onAction(false);
              onOpenChange();
            }}
            classNames="flex-1 mx-auto w-max rounded-lg bg-default-gradient p-3 text-sm font-semibold text-white"
          >
            {t('confirmChangeLayoutBtn')}
          </BaseButton>
          <BaseButton
            onClick={() => {
              onAction(true);
              onOpenChange();
            }}
            classNames="mx-auto w-max rounded-lg bg-default-gradient p-3 text-sm font-semibold text-white"
          >
            {t('confirmChangeLayoutBtnAi')}
            <CreditCost
              action={creditAction}
              icon={<CoinFilledWhite />}
              containerClassName={`border-l border-l-lightGrey/30`}
              costClassName={`text-lightGrey`}
            />
          </BaseButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;

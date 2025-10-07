import { useSubscriptionModal } from '@/hooks/useSubscriptionModal';
import Coins2Icon from '@/assets/coins-2.svg?react';
import { useTranslation } from 'react-i18next';

interface IProps {
  credits: number;
}

const CreditLeft = ({ credits }: IProps) => {
  const { onOpenCreditPacksChange } = useSubscriptionModal();
  
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });

  return (
    <div className='flex gap-2 bg-black text-white py-1 px-2 rounded-lg'>
      <Coins2Icon className="size-6" />
      <span
        onClick={() => onOpenCreditPacksChange()}
        className="cursor-pointer text-sm inline-block rounded py-0.5"
      >
        {credits} {t('creditsLeft')}
      </span>
    </div>
  );
};

export default CreditLeft;

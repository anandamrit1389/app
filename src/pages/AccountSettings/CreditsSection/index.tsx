import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import ExternalLinkIcon from '@/assets/external-link.svg?react';
import CoinsIcon from '@/assets/coins.svg?react';
import { useState } from 'react';
import TrasactionsModal from '@/components/Modals/TransactionModal';
import { useSubscriptionModal } from '@/hooks/useSubscriptionModal';

interface IProps {
  sectionRef: React.RefObject<HTMLDivElement>;
  credits: number;
  isMobile: boolean;
}

const CreditsSection = ({ sectionRef, credits, isMobile }: IProps) => {
  const { onOpenCreditPacksChange } = useSubscriptionModal();
  const { t } = useTranslation('translation', { keyPrefix: 'account' });

  const [showHistory, setShowHistory] = useState<boolean>(false);

  return (
    <div
      id="credits-account"
      ref={sectionRef}
      className={cn('p-10 bg-white', {
        'p-4': isMobile,
        'rounded-lg': !isMobile,
      })}
    >
      <div
        className={cn('w-11/12 flex flex-col gap-4', {
          'w-full': isMobile,
        })}
      >
        <div className="flex flex-row items-center justify-between">
          <p className="text-base font-semibold  text-darkHeadline">{t('creditsTitle')}</p>

          <BaseButton
            onClick={() => setShowHistory(true)}
            classNames="px-3 py-2 text-sm"
            variant="outline"
          >
            {t('creditHistoryBtn')}
            <ExternalLinkIcon />
          </BaseButton>
        </div>
        <p className="text-sm text-darkText">{t('creditsDescription')}</p>

        <div
          className="flex w-full cursor-pointer items-center gap-1 rounded-lg bg-lightGrey px-3 py-2"
          onClick={onOpenCreditPacksChange}
        >
          <CoinsIcon />
          <p className="text-sm text-darkText">
            <span className="">{credits}</span> {t(`credits`)}
          </p>
        </div>
      </div>
      <TrasactionsModal
        open={showHistory}
        onOpenChange={() => setShowHistory((prev) => !prev)}
        isMobile={isMobile}
      />
    </div>
  );
};

export default CreditsSection;

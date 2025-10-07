import { ArrowRight } from 'lucide-react';
import proAccountUpgradeImg from '@/assets/pro-account-upgrade.png';
import { Trans, useTranslation } from 'react-i18next';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { useSubscriptionModal } from '@/hooks/useSubscriptionModal';

import ProCrown from '@/assets/pro-crown.svg?react';

const AccountProUpgrade = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'pro_upgrade' });

  const { onOpenChange } = useSubscriptionModal();

  return (
    <div
      className="relative flex w-full cursor-pointer flex-row justify-between overflow-hidden rounded-lg bg-[#111827] px-5 py-7"
      onClick={onOpenChange}
    >
      <img
        className="absolute right-0 top-0 z-0 h-full rounded-lg"
        src={proAccountUpgradeImg}
        alt="bg"
      />
      <div className="flex max-w-[234px] flex-col justify-between gap-4">
        <div>
          <p className="text-base text-white ">
            <Trans
              i18nKey={`pro_upgrade.upgradeDescription`}
              components={{
                strong: <strong className="font-bold text-[#BD9E60]" />,
              }}
            />
          </p>
        </div>
        <BaseButton classNames="z-10 uppercase text-sm py-2 px-3 bg-[#BD9E60] w-fit flex items-center focus:bg-[#BD9E60] hover:bg-[#BD9E60]">
          <ProCrown /> {t('upgrade')}
        </BaseButton>
      </div>
      <div className="relative flex items-end">
        <ArrowRight className="absolute -bottom-[12px] -left-[24px] me-1 size-6 text-white" />
      </div>
    </div>
  );
};

export default AccountProUpgrade;

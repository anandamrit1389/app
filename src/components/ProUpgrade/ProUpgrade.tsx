import { ArrowRight } from 'lucide-react';
import proUpgradeImg from '@/assets/pro-upgrade.png';
import { useTranslation } from 'react-i18next';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { useSubscriptionModal } from '@/hooks/useSubscriptionModal';

import ProCrown from '@/assets/pro-crown.svg?react';

const ProUpgrade = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'dashboard' });

  const { onOpenChange } = useSubscriptionModal();

  return (
    <div
      className="relative flex h-[120px] cursor-pointer flex-col justify-between overflow-hidden rounded-lg bg-[#111827] px-2 pt-2"
      onClick={onOpenChange}
    >
      <img className="absolute right-0 top-0 z-0" src={proUpgradeImg} alt="bg" />
      <BaseButton classNames="z-10 uppercase text-[12px] py-1 px-2 bg-[#BD9E60] w-fit flex items-center focus:bg-[#BD9E60] hover:bg-[#BD9E60]">
        <ProCrown /> {t('upgrade')}
      </BaseButton>
      <div className="flex items-end">
        <p className="pb-2 text-[12px] text-white">{t('upgradeDescription')}</p>
        <ArrowRight className="me-1 size-10 text-white" />
      </div>
    </div>
  );
};

export default ProUpgrade;

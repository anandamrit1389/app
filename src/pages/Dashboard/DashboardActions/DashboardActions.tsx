import { useTranslation } from 'react-i18next';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import DashboardActionsImg from '@/assets/dasboard-action-bg.png';

import ProCrown from '@/assets/pro-crown.svg?react';
import { useSubscriptionModal } from '@/hooks/useSubscriptionModal';
import CheckIcon from '@/assets/check-icon.svg?react';
import useMobile from '@/hooks/useMobile';
import useTablet from '@/hooks/useTablet';

const DashboardActions = () => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'dashboardActions',
  });
  const isMobile = useMobile();
  const isTablet = useTablet();
  const HeaderTitle = () => {
    return (
      <div className="z-10 flex w-full items-center gap-1 py-1 text-[20px] font-bold md:w-fit md:gap-2 md:text-2xl">
        <ProCrown className="size-7 md:size-8" /> {t('upgradeToPro')}!
      </div>
    );
  };
  const HeaderList = () => {
    const list = [t('removeWatermark'), t('aiCredits'), t('unlockAllSlides'), t('seeFullList')];
    return (
      <div className="mr-auto flex min-w-fit flex-col justify-start max-[1400px]:w-2/5">
        <div
          className={`grid grid-cols-2 gap-x-8 gap-y-2 text-[14px] max-[1200px]:gap-2 ${
            isTablet ? 'gap-2' : ''
          }`}
        >
          {list.map((item, index) => (
            <div key={item} className="flex items-center gap-1 md:gap-2">
              {index !== 3 && <CheckIcon />}
              <p className="leading-none">{item}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  const { onOpenChange } = useSubscriptionModal();
  if (isMobile || isTablet)
    return (
      <div
        className={`relative flex w-full cursor-pointer flex-col justify-start gap-2 overflow-hidden rounded-lg bg-[#BD9E60] p-3 text-white ${
          isMobile ? 'items-center' : 'items-start'
        }`}
        onClick={onOpenChange}
      >
        <HeaderTitle />
        <HeaderList />

        <BaseButton classNames="z-20 w-full bg-[#111827] hover:bg-[#374151] focus:bg-[#030712]">
          {t('upgradeNow')}
        </BaseButton>
        <img className="absolute right-[-42%] top-[-7%] z-0 " src={DashboardActionsImg} alt="bg" />
      </div>
    );
  return (
    <div
      className="relative flex h-[104px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#BD9E60] p-6 text-white max-[1400px]:h-[126px] max-[1400px]:p-4"
      onClick={onOpenChange}
    >
      <div className=" flex w-full flex-row gap-16 max-[1400px]:flex-col max-[1400px]:gap-2">
        <HeaderTitle />
        <HeaderList />
      </div>
      <BaseButton classNames="z-20 bg-[#111827] hover:bg-[#374151] focus:bg-[#030712]">
        {t('upgradeNow')}
      </BaseButton>
      <img
        className="absolute right-0 top-0 z-0 max-[1400px]:-right-20 max-[1400px]:scale-150"
        src={DashboardActionsImg}
        alt="bg"
      />
    </div>
  );
};

export default DashboardActions;

import { useState } from 'react';
import { ISubscriptionPlan } from '@/interfaces/ISubscription';
import { useTranslation } from 'react-i18next';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import EnterpriceIcon from '@/assets/plans/enterprice-icon.svg?react';
import ProIcon from '@/assets/plans/pro-icon.svg?react';
import MinusIcon from '@/assets/plans/minus-icon.svg?react';
import PlusIcon from '@/assets/plans/plus-icon.svg?react';
import PlanFeatures from './PlanFeatures';
import useMobile from '@/hooks/useMobile';

const iconPlans = {
  business: <EnterpriceIcon className="mb-2" />,
  pro: <ProIcon className="mb-2" />,
  free: <></>,
};

const currencySymbols = { usd: '$' };

interface PlanCardProps {
  plan: ISubscriptionPlan;
  onSelectPlan: (priceId: string, seats: number) => void;
}

const PlanCard = ({ plan, onSelectPlan }: PlanCardProps) => {
  const isMobile = useMobile();

  const { t } = useTranslation('translation', { keyPrefix: 'pricingPlans' });
  const [seats, setSeats] = useState<number>(1);

  const handleIncrementSeats = () => setSeats((prev) => prev + 1);
  const handleDecrementSeats = () => setSeats((prev) => Math.max(1, prev - 1));

  const handlePlanClick = (priceId: string) => {
    if (plan.type === 'business') return onSelectPlan(priceId, seats);
    return onSelectPlan(priceId, 1);
  };

  return (
    <div
      className={`rounded-2xl border-2 border-card-stroke px-14 py-10 text-darkText
        ${isMobile ? 'min-w-[335px]' : 'max-w-[335px] basis-6/12'}
        ${plan.type === 'business' ? 'bg-[#FAF0E0]' : 'bg-[#FEFAF4]'}`}
    >
      {iconPlans[plan.type]}
      <div
        className={`
          ${isMobile ? 'text-[16px]' : 'text-[18px]'}
           mb-1 font-semibold`}
      >
        {t(plan.titleKey)}
      </div>
      <div
        className={`
        ${isMobile ? 'text-[28px]' : 'text-[32px]'}
        mb-1 font-semibold`}
      >
        {currencySymbols[plan.price.currency]}
        {plan.price.amount * seats}/{plan.price.interval}
      </div>
      <div
        className={`
        ${isMobile ? 'mb-6' : 'mb-8'}
        `}
      >
        {t(`${plan.descriptionKey}_${plan.price.interval}`)}
      </div>
      <BaseButton
        onClick={() => handlePlanClick(plan.price.id)}
        classNames={`w-full h-[48px] rounded-lg text-[16px] text-[#F8F9FA]`}
      >
        {t('get_started')}
      </BaseButton>
      {plan.type === 'business' && (
        <div className="mt-4 flex items-center justify-between rounded-full bg-[#00000014]">
          <BaseButton
            disabled={seats === 1}
            onClick={handleDecrementSeats}
            classNames="p-2 w-[40px] h-[40px] rounded-full bg-[#FFF] text-[#374151] focus:bg-[#eff0f2] hover:bg-[#f6f7f8]"
            icon={<MinusIcon />}
          />
          <div className="text-[18px] font-semibold">{`${seats} ${t('seats')}`}</div>
          <BaseButton
            onClick={handleIncrementSeats}
            classNames="p-2 w-[40px] h-[40px] rounded-full bg-[#FFF] text-[#374151] focus:bg-[#eff0f2] hover:bg-[#f6f7f8]"
            icon={<PlusIcon />}
          />
        </div>
      )}
      <PlanFeatures plan={plan} />
    </div>
  );
};

export default PlanCard;

import { useState } from 'react';
import { ISubscriptionPlan } from '@/interfaces/ISubscription';
import { useTranslation } from 'react-i18next';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import EnterpriceIcon from '@/assets/plans/enterprice-icon.svg?react';
import ProIcon from '@/assets/plans/pro-icon.svg?react';
import MinusIcon from '@/assets/plans/minus-icon.svg?react';
import PlusIcon from '@/assets/plans/plus-icon.svg?react';
import SubscriptionFeatures from './SubscriptionFeatures';
import useMobile from '@/hooks/useMobile';
import { analyticsService } from '@/helpers/services/AnalyticsService';

const iconPlans = {
  business: <EnterpriceIcon className="mb-2" />,
  pro: <ProIcon className="mb-2" />,
  free: <></>,
};

const currencySymbols = { usd: '$' };

interface PlanCardProps {
  plan: ISubscriptionPlan;
  onSelectPlan: (priceId: string, seats: number) => void;
  ctaText?: string;
}

const PlanCard = ({ plan, onSelectPlan, ctaText }: PlanCardProps) => {
  const { t } = useTranslation('translation');
  const [seats, setSeats] = useState<number>(1);
  const isMobile = useMobile();

  const handleIncrementSeats = () => setSeats((prev) => prev + 1);
  const handleDecrementSeats = () => setSeats((prev) => Math.max(1, prev - 1));

  const handlePlanClick = (priceId: string) => {
    analyticsService.trackSubscriptionPlanSelect(plan.type, plan.price.amount, plan.price.currency);
    
    if (plan.type === 'business') return onSelectPlan(priceId, seats);
    return onSelectPlan(priceId, 1);
  };

  return (
    <div
      className={`rounded-2xl border-2 border-card-stroke px-14 py-10 text-darkText relative
        ${plan.type === 'business' ? 'bg-[#FAF0E0]' : 'bg-[#FEFAF4]'}`}
    >
      {isMobile && plan.type === 'business' && (
        <div className="!absolute !top-3 !right-3 !bg-[#BD9E60] !text-white !text-xs !font-medium !px-3 !py-1 !rounded-full z-10 uppercase">
          {t('pricingPlans.best_value')}
        </div>
      )}
      <div className="flex-col gap-2 md:gap-8">
        <div className="w-max md:w-[250px]">
          {iconPlans[plan.type]}
          <div className="mb-1 text-sm font-semibold uppercase text-text-primary md:text-base">
            {t(`pricingPlans.${plan.titleKey}`)}
          </div>
          <div className="text-2xl font-bold text-text-secondary md:text-[32px]">
            {currencySymbols[plan.price.currency]}
            {plan.price.interval === 'year'
              ? (plan.price.amount / 12).toFixed(1)
              : plan.price.amount}
            /{t('pricingPlans.month')}
          </div>
          <div className="text-sm text-text-secondary">
            {plan.price.interval === 'year'
              ? t('pricingPlans.billedAnnually', {
                  amount: `${currencySymbols[plan.price.currency]}${plan.price.amount}`,
                })
              : t(`pricingPlans.${plan.descriptionKey}_${plan.price.interval}`)}
          </div>
        </div>
        <BaseButton
          onClick={() => handlePlanClick(plan.price.id)}
          classNames="w-full h-[48px] rounded-lg text-base leading-none text-[#F8F9FA] mt-8 mb-3 "
        >
          {ctaText || t('subscribeNow', 'Subscribe Now')}
        </BaseButton>

        {plan.type === 'business' && (
          <div className="mb-3 mt-4 flex items-center justify-between rounded-full bg-[#00000014]">
            <BaseButton
              disabled={seats === 1}
              onClick={handleDecrementSeats}
              classNames="p-2 w-[40px] h-[40px] rounded-full bg-[#FFF] text-[#374151] focus:bg-[#eff0f2] hover:bg-[#f6f7f8]"
              icon={<MinusIcon />}
            />
            <div className="text-[18px] font-semibold">{`${seats} ${t('pricingPlans.seats')}`}</div>
            <BaseButton
              onClick={handleIncrementSeats}
              classNames="p-2 w-[40px] h-[40px] rounded-full bg-[#FFF] text-[#374151] focus:bg-[#eff0f2] hover:bg-[#f6f7f8]"
              icon={<PlusIcon />}
            />
          </div>
        )}

        <SubscriptionFeatures plan={plan} period={plan.price.interval} />
      </div>
    </div>
  );
};

export default PlanCard;

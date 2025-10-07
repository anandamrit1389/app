import { ISubscriptionPlan } from '@/interfaces/ISubscription';
import { useTranslation } from 'react-i18next';
import ProCheckIcon from '@/assets/plans/check-pro-icon.svg?react';
import useMobile from '@/hooks/useMobile';

interface PlanFeaturesProps {
  plan: ISubscriptionPlan;
}

const PlanFeatures = ({ plan }: PlanFeaturesProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'pricingPlans' });
  const isMobile = useMobile();

  return (
    <div
      className={`
        ${isMobile ? 'mt-6' : 'mt-8'}
        `}
    >
      {plan.features.map((feature) => (
        <div
          className={`
        ${isMobile ? 'mb-2' : 'mb-3'}
        flex gap-2 text-[14px]
        `}
          key={feature.id}
        >
          <ProCheckIcon />
          <div>{t(feature.titleKey)}</div>
        </div>
      ))}
    </div>
  );
};

export default PlanFeatures;

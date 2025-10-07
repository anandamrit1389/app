import { useTranslation } from 'react-i18next';
import ProCheckIcon from '@/assets/plans/check-pro-icon.svg?react';
import { ISubscriptionPlan } from '@/interfaces/ISubscription';

interface SubscriptionFeaturesProps {
  plan: ISubscriptionPlan;
  period?: string;
}

const SubscriptionFeatures = ({ plan, period }: SubscriptionFeaturesProps) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'pricingPlans',
  });

  const amount = period ? { amount: period === 'month' ? 200 : 2000 } : {};

  return (
    <div>
      {plan.features.map((feature) => (
        <div className="mb-3 flex gap-2 text-[14px] last:mb-0" key={feature.id}>
          <ProCheckIcon className="shrink-0" />
          <div>{t(feature.titleKey, amount)}</div>
        </div>
      ))}
    </div>
  );
};

export default SubscriptionFeatures;

import { CreditAction } from '@/interfaces/IPricing';
import { PricingContext } from '@/contexts/Pricing.context';
import { useContext } from 'react';

interface CreditCostProps {
  action: CreditAction;
  icon?: React.ReactNode;
  containerClassName?: string;
  costClassName?: string;
}

const CreditCost = ({ action, icon, containerClassName, costClassName }: CreditCostProps) => {
  const { getCreditCost, isLoading } = useContext(PricingContext);
  const cost = getCreditCost(action)?.cost;

  return (
    <div className="flex items-center gap-2">
      <div className={`flex items-center gap-1 px-2 ${containerClassName}`}>
        {icon}
        <span className={`text-base font-semibold ${costClassName}`}>
          {isLoading ? '...' : (cost ?? '—')}
        </span>
      </div>
    </div>
  );
};

export default CreditCost;

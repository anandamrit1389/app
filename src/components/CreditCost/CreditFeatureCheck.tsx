import { ReactNode } from 'react';
import { useCreditsCheck } from '@/hooks/useCreditsCheck';
import { CreditAction } from '@/interfaces/IPricing';

interface CreditFeatureCheckProps {
  action: CreditAction;
  children: ReactNode;
  onInsufficientCredits?: () => void;
}

const CreditFeatureCheck = ({
  action,
  children,
  onInsufficientCredits,
}: CreditFeatureCheckProps) => {
  const { hasEnoughCredits } = useCreditsCheck();

  const handleFeatureAccess = (e: React.MouseEvent) => {
    if (!hasEnoughCredits(action)) {
      e.preventDefault();
      e.stopPropagation();
      
      if (onInsufficientCredits) {
        onInsufficientCredits();
      }
      
      return false;
    }
    
    return true;
  };

  return <div onClick={handleFeatureAccess}>{children}</div>;
};

export default CreditFeatureCheck; 
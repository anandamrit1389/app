import { useContext } from 'react';
import { AuthContext } from '@/providers/auth.provider';
import { useSubscriptionModal } from './useSubscriptionModal';
import { PricingContext } from '@/contexts/Pricing.context';
import { CreditAction } from '@/interfaces/IPricing';

export const useCreditsCheck = () => {
  const { user } = useContext(AuthContext);
  const { onOpenCreditPacksChange } = useSubscriptionModal();
  const { getCreditCost } = useContext(PricingContext);

  const hasEnoughCredits = (action: CreditAction, showModalIfNotEnough = true): boolean => {
    if (!user) return false;
    
    const actionConfig = getCreditCost(action);
    if (!actionConfig) return true;
    
    const requiredCredits = actionConfig.cost;
    const hasEnough = user.credits >= requiredCredits;
    
    if (!hasEnough && showModalIfNotEnough) {
      setTimeout(() => onOpenCreditPacksChange(), 0);
    }
    
    return hasEnough;
  };

  const getActionCost = (action: CreditAction): number => {
    const actionConfig = getCreditCost(action);
    return actionConfig?.cost || 0;
  };

  return { 
    hasEnoughCredits,
    getActionCost
  };
}; 
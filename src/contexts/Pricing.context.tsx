import { createContext, useEffect, useState } from 'react';
import PricingService from '@/api/pricingService';
import { CreditAction, CreditActionConfig } from '@/interfaces/IPricing';

interface PricingContextType {
  pricingConfig: Record<CreditAction, CreditActionConfig> | null;
  isLoading: boolean;
  error: Error | null;
  getCreditCost: (action: CreditAction) => CreditActionConfig | null;
}

export const PricingContext = createContext<PricingContextType>({
  pricingConfig: null,
  isLoading: false,
  error: null,
  getCreditCost: () => null,
});

export const PricingProvider = ({ children }: { children: React.ReactNode }) => {
  const [pricingConfig, setPricingConfig] = useState<Record<
    CreditAction,
    CreditActionConfig
  > | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPricingConfig = async () => {
      setIsLoading(true);
      try {
        const config = await PricingService.getPricingConfig();
        setPricingConfig(config);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPricingConfig();
  }, []);

  const getCreditCost = (action: CreditAction): CreditActionConfig | null => {
    if (!pricingConfig) return null;
    return pricingConfig[action] || null;
  };

  return (
    <PricingContext.Provider value={{ pricingConfig, isLoading, error, getCreditCost }}>
      {children}
    </PricingContext.Provider>
  );
};

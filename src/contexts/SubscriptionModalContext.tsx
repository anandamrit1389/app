import { ISubscriptionType } from '@/interfaces/ISubscription';
import { createContext, useState, ReactNode } from 'react';
import { analyticsService } from '@/helpers/services/AnalyticsService';

type SubscriptionModalContextType = {
  open: boolean;
  openCreditsModal: boolean;
  onOpenChange: () => void;
  filters: ISubscriptionType[];
  handleChangeFilter: (filters: ISubscriptionType[]) => void;
  onOpenCreditPacksChange: () => void;
};

const initFilters: ISubscriptionType[] = ['business', 'pro'];

export const SubscriptionModalContext = createContext<SubscriptionModalContextType | undefined>(
  undefined,
);

export const SubscriptionModalProvider = ({ children }: { children: ReactNode }) => {
  const [open, setIsOpen] = useState(false);
  const [filters, setFilter] = useState<ISubscriptionType[]>(initFilters);
  const [openCreditsModal, setOpenCreditsModal] = useState(false);

  const handleChangeFilter = (filters: ISubscriptionType[]) => {
    setFilter(filters);
  };

  const onOpenChange = () => {
    if (open) {
      setFilter(initFilters);
    } else {
      const planType = filters.includes('business') ? 'enterprise' : 'pro';
      const trigger = 'upgrade_prompt';
      analyticsService.trackSubscriptionModalView(planType, trigger);
    }
    setIsOpen(!open);
  };

  const onOpenCreditPacksChange = () => {
    setOpenCreditsModal(!openCreditsModal);
  };

  return (
    <SubscriptionModalContext.Provider
      value={{
        openCreditsModal,
        open,
        onOpenChange,
        filters,
        handleChangeFilter,
        onOpenCreditPacksChange,
      }}
    >
      {children}
    </SubscriptionModalContext.Provider>
  );
};

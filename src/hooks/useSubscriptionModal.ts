import { SubscriptionModalContext } from '@/contexts/SubscriptionModalContext';
import { useContext } from 'react';

export const useSubscriptionModal = () => {
  const context = useContext(SubscriptionModalContext);
  if (!context) {
    throw new Error('useSubscriptionModal must be used within a SubscriptionModalProvider');
  }
  return context;
};

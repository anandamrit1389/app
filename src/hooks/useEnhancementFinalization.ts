import { EnhancementContext } from '@/contexts/Enhancement.context';
import { useContext } from 'react';

export const useEnhancementFinalization = () => {
  const context = useContext(EnhancementContext);

  if (!context) {
    throw new Error('useEnhancementFinalization must be used within a EnhancementProvider');
  }

  return context;
};

import { InfoModalContext } from '@/contexts/InfoModalContext';
import { useContext } from 'react';

export const useInfoModal = () => {
  const context = useContext(InfoModalContext);
  if (!context) {
    throw new Error('useInfoModal must be used within a InfoModalProvider');
  }
  return context;
};

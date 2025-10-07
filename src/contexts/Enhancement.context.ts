import { Enhancement } from '@/interfaces/enhancement.interface';
import { createContext } from 'react';

const initialEnhancementContext: Enhancement = {
  enhanceFile: null,
  loadEnhanceFile: async () => null,
  handeAddEnhanceFile: () => {},
  handleRemoveEnhanceFile: () => {},
  thumbnail: null,
  setThumbnail: () => {},
};

export const EnhancementContext = createContext<Enhancement>(initialEnhancementContext);

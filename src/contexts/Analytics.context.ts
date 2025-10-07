import { IUseSlideAnalytics } from '@/hooks/useSlideAnalytics';
import { createContext } from 'react';

export const AnalyticsContext = createContext<IUseSlideAnalytics>({} as IUseSlideAnalytics);

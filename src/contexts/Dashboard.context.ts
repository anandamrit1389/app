import { ITemplatePreview } from '@/helpers/constants/presentation-templates.const';
import { IUseDashboard } from '@/hooks/useDashboard';
import { createContext } from 'react';

export const PersonalContext = createContext<IUseDashboard>({} as IUseDashboard);
export const TeamContext = createContext<IUseDashboard>({} as IUseDashboard);
export const CommonContext = createContext<{ templates: ITemplatePreview[] }>(
  {} as { templates: ITemplatePreview[] },
);

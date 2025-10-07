import { createContext } from 'react';
import { ITemplate } from '@/interfaces/ISlides';

interface TemplateContextType {
  templateTemplateInfo: ITemplate | undefined;
}

export const TemplateContext = createContext<TemplateContextType>({} as TemplateContextType);

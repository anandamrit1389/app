import { IUsePromptPage } from '@/hooks/usePromptPage';
import { createContext } from 'react';

export const PromptPageContext = createContext<IUsePromptPage>({} as IUsePromptPage);

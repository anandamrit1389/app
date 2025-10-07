import { IUsePrettifyPage } from '@/hooks/usePrettifyPage';
import { createContext } from 'react';

export const PrettifyContext = createContext<IUsePrettifyPage>({} as IUsePrettifyPage);

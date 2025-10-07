import { IUsePresentation } from '@/interfaces/IUsePresentation';
import { createContext } from 'react';

export const PresentationContext = createContext<IUsePresentation>({} as IUsePresentation);

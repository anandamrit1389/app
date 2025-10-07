import { createContext } from 'react';
import { ICompanyContext } from '@/interfaces/companies';

export const CompanyContext = createContext<ICompanyContext>({} as ICompanyContext);

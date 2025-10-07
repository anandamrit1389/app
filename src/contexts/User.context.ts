import { createContext } from 'react';
import { IUseUser } from '@/hooks/useTempUser';

interface IUserContext extends IUseUser {}

export const UserContext = createContext<IUserContext>({} as IUserContext);

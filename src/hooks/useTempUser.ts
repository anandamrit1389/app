import { useState } from 'react';

type TempUser = { email: string; password: string };

export interface IUseUser {
  tempUser: TempUser;
  handleUpdateTempUser: (user: TempUser) => void;
}

const useTempUser = (): IUseUser => {
  const [tempUser, setTempUser] = useState<TempUser>({
    email: '',
    password: '',
  });

  const handleUpdateTempUser = (user: TempUser) => {
    setTempUser(user);
  };

  return { tempUser, handleUpdateTempUser };
};

export default useTempUser;

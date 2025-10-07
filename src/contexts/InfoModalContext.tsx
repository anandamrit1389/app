import { createContext, useState, ReactNode } from 'react';

type IModalProp = {
  titleKey: string;
  bodyKey: string;
  headerKey: string;
};

const initProp: IModalProp = {
  titleKey: '',
  bodyKey: '',
  headerKey: '',
};

type InfoModalContextType = {
  open: boolean;
  modalData: IModalProp;
  onShowInfo: (val: IModalProp) => void;
  onCloseDialog: () => void;
};

export const InfoModalContext = createContext<InfoModalContextType | undefined>(undefined);

export const InfoModalProvider = ({ children }: { children: ReactNode }) => {
  const [open, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState(initProp);

  const onShowInfo = (val: IModalProp) => {
    setModalData(val);
    setIsOpen(true);
  };

  const onCloseDialog = () => {
    setIsOpen(false);
    setModalData(initProp);
  };

  return (
    <InfoModalContext.Provider value={{ open, onShowInfo, modalData, onCloseDialog }}>
      {children}
    </InfoModalContext.Provider>
  );
};

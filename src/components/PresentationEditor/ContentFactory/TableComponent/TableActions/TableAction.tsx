import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import FloatingContainer from '@/components/FloatingContainer/FloatingContainer';
import EditData from '@/assets/edit.svg?react';
import { useTranslation } from 'react-i18next';

interface IProps {
  isOpen: boolean;
  onClose?: () => void;
  x?: number;
  y?: number;
  mobile?: boolean;
  setIsDataEditing: (val: boolean) => void;
  setIsOpen: (val: boolean) => void;
}

const TableActions = ({ isOpen, onClose, x, y, mobile, setIsDataEditing, setIsOpen }: IProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });

  if (mobile) {
    return (
      <div className="w-full rounded-t-2xl bg-white shadow-lg">
        <BaseButton
          variant="ghost"
          classNames="text-darkGrey w-full justify-start"
          onClick={() => {
            setIsDataEditing(true);
            setIsOpen(false);
          }}
        >
          <EditData /> {t('editData')}
        </BaseButton>
      </div>
    );
  }

  return (
    <FloatingContainer x={x ?? 0} y={y ?? 0} onClose={() => onClose?.()} isOpen={isOpen}>
      <div className="w-[200px] rounded-lg bg-white shadow-lg">
        <BaseButton
          variant="ghost"
          classNames="text-darkGrey w-full justify-start font-normal p-3"
          onClick={() => {
            setIsDataEditing(true);
            setIsOpen(false);
          }}
        >
          <EditData /> {t('editData')}
        </BaseButton>
      </div>
    </FloatingContainer>
  );
};

export default TableActions;

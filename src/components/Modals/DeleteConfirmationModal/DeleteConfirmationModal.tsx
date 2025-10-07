import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import useMobile from '@/hooks/useMobile';

interface IProps {
  open: boolean;
  onOpenChange: () => void;
  title: string;
  description: string;
  onAction: () => void;
}

const DeleteConfirmationModal = ({ open, onOpenChange, title, description, onAction }: IProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'modals' });
  const isMobile = useMobile();
  return (
    <Dialog open={open} onOpenChange={() => onOpenChange()}>
      <DialogContent className={`${isMobile ? 'w-[95%] p-3 rounded-lg' : 'w-[440px] p-8'} gap-0`}>
        <DialogTitle className="mb-2 font-bold text-darkHeadline">{title}</DialogTitle>
        <p className="mb-4 font-normal text-darkText">{description}</p>
        <div className="flex justify-end gap-x-2">
          <DialogClose asChild>
            <BaseButton variant="outline" onClick={onOpenChange}>
              {t('cancel')}
            </BaseButton>
          </DialogClose>
          <BaseButton
            variant="destructive"
            onClick={() => {
              onAction();
              onOpenChange();
            }}
            classNames="text-white"
          >
            {t('delete')}
          </BaseButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationModal;

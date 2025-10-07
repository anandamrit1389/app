import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slideNumber: number | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationDialog = ({
  open,
  onOpenChange,
  slideNumber,
  onConfirm,
  onCancel,
}: DeleteConfirmationDialogProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'modals' });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="absolute">
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="bg-lightGreyHover rounded-full size-6" />
        </button>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[24px]">{t('areYouSure')}</AlertDialogTitle>
          <AlertDialogDescription className="text-[18px]">
            {t('slide')} {slideNumber !== null ? slideNumber + 1 : ''} {t('containsInstructions')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-black hover:bg-gray-800">
            {t('delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationDialog; 
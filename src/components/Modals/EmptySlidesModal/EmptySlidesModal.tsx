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
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface EmptySlidesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReduceSlides: () => void;
  onFillWithContent: () => void;
}

const EmptySlidesModal = ({
  open,
  onOpenChange,
  onReduceSlides,
  onFillWithContent,
}: EmptySlidesModalProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'modals' });
  const handleReduceSlides = () => {
    onReduceSlides();
    onOpenChange(false);
  };

  const handleFillWithContent = () => {
    onFillWithContent();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="absolute">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="bg-lightGreyHover rounded-full size-6" />
        </button>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[24px]"> {t('emptySlides')} </AlertDialogTitle>
          <AlertDialogDescription className="text-[18px]">
            {t('emptySlidesDescription')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleReduceSlides}>{t('reduceSlides')}</AlertDialogCancel>
          <AlertDialogAction onClick={handleFillWithContent} className="bg-black hover:bg-gray-800">
            {t('fillWithContent')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EmptySlidesModal;

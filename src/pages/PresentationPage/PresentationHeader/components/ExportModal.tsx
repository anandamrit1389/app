import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import ExportTab from './ExportTab';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';

interface IProps {
  open: boolean;
  onOpenChange: () => void;
  mobile?: boolean;
}

const ExportModal = ({ open, onOpenChange, mobile }: IProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });

  if (mobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full transition-all" side="left">
          <SheetTitle className="hidden">{t('export')}</SheetTitle>
          <ExportTab />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-fit p-8 transition-all">
        <DialogTitle className="hidden">{t('export')}</DialogTitle>
        <ExportTab />
      </DialogContent>
    </Dialog>
  );
};

export default ExportModal;

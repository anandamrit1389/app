import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import ShareTab from './ShareTab';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { IPresentation } from '@/interfaces/ISlides';

interface IProps {
  open: boolean;
  onOpenChange: () => void;
  mobile?: boolean;
  readonly?: boolean;
  presentationData?: IPresentation;
}

const ShareModal = ({ open, onOpenChange, mobile, readonly, presentationData }: IProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });
  if (mobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full transition-all" side="left">
          <SheetTitle className="hidden">{t('share')}</SheetTitle>
          <ShareTab readonly={readonly} presentationData={presentationData} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-fit transition-all">
        <DialogTitle className="hidden">{t('share')}</DialogTitle>
        <ShareTab readonly={readonly} presentationData={presentationData} />
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;

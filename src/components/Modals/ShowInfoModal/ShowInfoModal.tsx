import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ShowInfoModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  description: string;
  title?: string;
}

const ShowInfoModal = ({ isOpen, onOpenChange, description, title }: ShowInfoModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-darkHeadline md:text-2xl">
            {title}
          </DialogTitle>
          <DialogDescription className="!mt-2 text-sm text-darkText">
            {description}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ShowInfoModal;

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { FileText } from 'lucide-react';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import AIPrompt from '@/assets/ai-stars-1.svg?react';
import { useTranslation } from 'react-i18next';

interface EnhancementFinalizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFinalize: () => void;
  onLater: () => void;
  presentationName?: string;
  thumb?: string | null;
}

const EnhancementFinalizationModal: React.FC<EnhancementFinalizationModalProps> = ({
  isOpen,
  onClose,
  onFinalize,
  onLater,
  presentationName = 'your presentation',
  thumb
}) => {
  const { t } = useTranslation('translation');
  // const { user, hasActiveSubscription } = useContext(AuthContext);

  // const getCounterText = () => {
  //   const freeLimit = user?.extraPresentationLimit ?? 0;
  //   const proLimit = user?.presentationLimit ?? 0;

  //   if (freeLimit > 0) {
  //     return `${freeLimit} ${freeLimit === 1 ? t('dashboard.presentation') : t('dashboard.presentations')}`;
  //   }

  //   if (hasActiveSubscription) {
  //     const totalLimit = user?.subscription?.ownedSubscription?.interval === 'month' ? 15 : 180;
  //     return `${proLimit} / ${totalLimit} ${t('left')}`;
  //   }

  //   return `0 / 3 ${t('left')}`;
  // };

  const handleLater = () => {
    onLater();
    onClose();
  };

  const handleFinalize = () => {
    onFinalize();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
              <AIPrompt className="w-10 h-10" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl font-semibold">
            {t('modals.finalizationModal.title')}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            {t('modals.finalizationModal.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <FileText className="w-5 h-5 text-gray-500" />
            <div>
              <p className="font-medium text-sm">
                {t('modals.finalizationModal.presentationReady')}
              </p>
              <p className="text-xs text-gray-600">
                <strong>{presentationName}</strong>{' '}
                {t('modals.finalizationModal.presentationStatus')}
              </p>
            </div>
          </div>
          {thumb && <img className='rounded-xl' src={thumb} />}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <BaseButton variant="outline" onClick={handleLater} classNames="w-full">
            {t('modals.finalizationModal.later')}
          </BaseButton>
          <BaseButton onClick={handleFinalize} classNames="w-full">
            {t('modals.finalizationModal.finalize')}
          </BaseButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancementFinalizationModal;

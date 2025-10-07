import EnhancementFinalizationModal from '@/components/Modals/EnhancementFinalizationModal/EnhancementFinalizationModal';
import { useEnhancementFinalization } from '@/hooks/useEnhancementFinalization';
import useLocaleNavigate from '@/hooks/useLocaleNavigate';
import { useSubscriptionModal } from '@/hooks/useSubscriptionModal';
import { useEffect, useState } from 'react';

function EnhancementFinalization() {
  const { enhanceFile, loadEnhanceFile, handeAddEnhanceFile, handleRemoveEnhanceFile, thumbnail } =
    useEnhancementFinalization();
  const { open: subscriptionModalOpen } = useSubscriptionModal();

  const [isEnhancementModalOpen, setIsEnhancementModalOpen] = useState(false);

  const navigate = useLocaleNavigate();

  const handleFinalize = () => {
    setIsEnhancementModalOpen(false);
    navigate('/enhance');
  };

  const handleLater = () => {
    setIsEnhancementModalOpen(false);
    handleRemoveEnhanceFile();
  };

  const handleClose = () => {
    setIsEnhancementModalOpen(false);
    handleRemoveEnhanceFile();
  }

  useEffect(() => {
    const getEnhanceFileFromStorage = async () => {
      const result = await loadEnhanceFile();

      if (result) {
        handeAddEnhanceFile(result);
      }
    };

    getEnhanceFileFromStorage();
  }, []);

  useEffect(() => {
    if (enhanceFile && !isEnhancementModalOpen && !subscriptionModalOpen) {
      setTimeout(() => {
        setIsEnhancementModalOpen(true);
      }, 1500);
    }
  }, [enhanceFile, open, subscriptionModalOpen]);

  if (!enhanceFile) return null;

  return (
    <EnhancementFinalizationModal
      isOpen={isEnhancementModalOpen}
      onClose={handleClose}
      onFinalize={handleFinalize}
      onLater={handleLater}
      presentationName={enhanceFile.name}
      thumb={thumbnail}
    />
  );
}

export default EnhancementFinalization;

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Textarea } from '@/components/ui/textarea';
import { useFeedback } from '@/hooks/useFeedback';
import { FeedbackType } from '@/interfaces/feedbacks';
import BaseButton from '../CustomUI/BaseButton/BaseButton';
import LovedItIcon from '@/assets/mood-smile-beam.svg?react';
import NotReallyIcon from '@/assets/mood-sad.svg?react';
import { Label } from '../ui/label';
import { useTranslation } from 'react-i18next';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  presentationId?: string;
}

const FeedbackDialog: React.FC<FeedbackModalProps> = ({ isOpen, onClose, presentationId }) => {
  const { createFeedback, loading } = useFeedback();
  const [selectedType, setSelectedType] = useState<FeedbackType | null>(null);
  const [description, setDescription] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);
  const { t } = useTranslation();

  const handleLoveIt = async () => {
    const success = await createFeedback({
      type: FeedbackType.LOVED_IT,
      presentationId,
    });

    if (success) {
      setShowThankYou(true);
      setTimeout(() => {
        handleClose();
      }, 3000);
    }
  };

  const handleNotReally = () => {
    setSelectedType(FeedbackType.NOT_REALLY);
  };

  const handleSubmitNotReally = async () => {
    const success = await createFeedback({
      type: FeedbackType.NOT_REALLY,
      description: description.trim() || undefined,
      presentationId,
    });

    if (success) {
      setShowThankYou(true);
      setTimeout(() => {
        handleClose();
      }, 3000);
    }
  };

  const resetModal = () => {
    setSelectedType(null);
    setDescription('');
    setShowThankYou(false);
  };

  const handleClose = () => {
    onClose();
    resetModal();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleClose();
    }
  };

  if (showThankYou) {
    return (
      <Dialog open onOpenChange={handleOpenChange}>
        <DialogContent className="bottom-10 left-auto right-10 top-auto translate-x-0 translate-y-0 rounded-2xl border-2 border-black/10 shadow-section-shadow sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="mb-2 text-[20px] leading-[28px] text-text-primary">
              {t('feedbacks.thankYou.title')}
            </DialogTitle>
            <DialogDescription className="text-text-secondary">
              {t('feedbacks.thankYou.description')}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
        className="bottom-10 left-auto right-10 top-auto translate-x-0 translate-y-0 rounded-2xl border-2 border-black/10 shadow-section-shadow sm:max-w-[400px]"
      >
        <DialogHeader>
          <DialogTitle className="mb-2 text-[20px] leading-[28px] text-text-primary">
            {t('feedbacks.title')}
          </DialogTitle>
          <DialogDescription className="text-text-secondary">
            {t('feedbacks.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4">
          <BaseButton
            classNames="w-full h-10"
            variant="secondary"
            onClick={handleLoveIt}
            disabled={loading}
            icon={<LovedItIcon />}
          >
            {t('feedbacks.buttons.lovedIt')}
          </BaseButton>
          <BaseButton
            classNames="w-full h-10"
            variant="secondary"
            onClick={handleNotReally}
            icon={<NotReallyIcon />}
            disabled={loading}
          >
            {t('feedbacks.buttons.notReally')}
          </BaseButton>
        </div>

        {selectedType && (
          <div>
            <Label className="mb-2">{t('feedbacks.feedbackLabel')}</Label>
            <Textarea
              id="feedback-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('feedbacks.placeholder')}
              className="mb-6 h-10 resize-none border border-neutral-200 bg-transparent px-3 py-[9px] placeholder:not-italic"
              disabled={loading}
            />
            <div className="flex justify-end gap-2">
              <BaseButton
                onClick={() => handleOpenChange(false)}
                disabled={loading}
                variant="secondary"
              >
                {t('feedbacks.buttons.close')}
              </BaseButton>
              <BaseButton onClick={handleSubmitNotReally} disabled={loading}>
                {t('feedbacks.buttons.submit')}
              </BaseButton>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;

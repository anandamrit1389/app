import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { toast } from 'sonner';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import AIStar from '@/assets/star-filled.svg?react';
import Loader from '@/assets/loader-color.svg?react';
import OpenAIService from '@/api/openAiService';

interface IProps {
  open: boolean;
  onOpenChange: () => void;
  title: string;
  description: string;
  onAction: () => void;
  prompt: string;
  setPrompt: (val: string) => void;
  mobile?: boolean;
}
const CreateConfirmationModal = ({
  open,
  onOpenChange,
  title,
  description,
  onAction,
  prompt,
  setPrompt,
  mobile,
}: IProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'modals' });
  const [loading, setLoading] = useState(false);
  const handleImprove = async () => {
    setLoading(true);
    try {
      const response = await OpenAIService.improvePrompt(prompt);
      setPrompt(response.data);
      onOpenChange();
    } catch (error) {
      console.error(error);
      toast.error(t('failedImprovePrompt'));
    } finally {
      setLoading(false);
    }
  };

  if (mobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="flex w-full flex-col justify-between p-4">
          <div className="flex grow flex-col justify-center">
            <SheetTitle className="text-center font-bold text-darkHeadline">{title}</SheetTitle>
            <p className="mb-4 text-center text-darkText">{description}</p>
          </div>
          <div className="mt-auto flex flex-col justify-end gap-4">
            <BaseButton
              variant="destructive"
              onClick={handleImprove}
              disabled={loading}
              classNames="w-full h-10 flex items-center justify-center"
            >
              {loading ? (
                <Loader className="size-4 animate-spin" />
              ) : (
                <p className="flex items-center">
                  <AIStar />
                  <span className="ml-2">{t('improve')}</span>
                </p>
              )}
            </BaseButton>
            <BaseButton
              variant="outline"
              onClick={() => {
                onAction();
                onOpenChange();
              }}
              classNames="w-full h-10 flex items-center justify-center"
            >
              {t('continue')}
            </BaseButton>
          </div>
        </SheetContent>
      </Sheet>
    );
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[440px] gap-0 p-8">
        <DialogTitle className="mb-2 font-bold text-darkHeadline">{title}</DialogTitle>
        <p className="mb-4 font-normal text-darkText">{description}</p>
        <div className="flex max-h-10 justify-end gap-x-2">
          <BaseButton
            variant="destructive"
            onClick={handleImprove}
            disabled={loading}
            classNames="w-[110px] flex items-center justify-center bg-slushPink/90"
          >
            {loading ? (
              <Loader className="size-4 animate-spin" />
            ) : (
              <p className="flex items-center">
                <AIStar />
                <span className="ml-2">{t('improve')}</span>
              </p>
            )}
          </BaseButton>
          <BaseButton
            variant="outline"
            onClick={() => {
              onAction();
              onOpenChange();
            }}
          >
            {t('continue')}
          </BaseButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default CreateConfirmationModal;

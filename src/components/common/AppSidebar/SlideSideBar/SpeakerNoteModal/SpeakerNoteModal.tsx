import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import SpeakerNoteAITab from './SpeakerNoteAITab';
import SpeakerNoteCustomTab from './SpeakerNoteCustomTab';
import AIPromptIcon from '@/assets/ai-stars-1.svg?react';
import WritingIcon from '@/assets/writing.svg?react';

interface IProps {
  open: boolean;
  onOpenChange: () => void;
}

const SpeakerNoteModal = ({ open, onOpenChange }: IProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[580px] max-h-[95vh] max-w-full p-0 pt-8 transition-all">
        <DialogTitle className="hidden">{t('exportAndShare')}</DialogTitle>
        <Tabs defaultValue="ai">
          <div className="px-8">
            <TabsList>
              <TabsTrigger value="ai" className="group mr-4 pl-1 pr-2">
                <AIPromptIcon className="mr-1" /> {t('aiPrompt')}
              </TabsTrigger>
              <TabsTrigger value="custom" className="mr-4 pl-1 pr-2">
                <WritingIcon className="mr-1" /> {t('writeYourself')}
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="ai">
            <SpeakerNoteAITab onOpenChange={onOpenChange} />
          </TabsContent>
          <TabsContent value="custom">
            <SpeakerNoteCustomTab onOpenChange={onOpenChange} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SpeakerNoteModal;

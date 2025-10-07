import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import useViewportSize from '@/hooks/useViewportSize';
import { useTranslation } from 'react-i18next';
import ArrowBack from '@/assets/arrow-back.svg?react';
import AIStars from '@/assets/ai-stars-3.svg?react';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';

interface IProps {
  open: boolean;
  onChangeOpen: () => void;
  prompt: string;
  setPrompt: (val: string) => void;
  onGenerate: () => void;
}

const ImagePromptSheet = ({ open, onChangeOpen, prompt, setPrompt, onGenerate }: IProps) => {
  const viewportSize = useViewportSize();
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onGenerate();
    }
  };

  return (
    <Sheet open={open} onOpenChange={onChangeOpen}>
      <SheetContent
        outsideclose="true"
        side="bottom"
        className={`align-start flex h-dvh w-full flex-col justify-start bg-lightGrey p-0`}
      >
        <div
          style={{ height: viewportSize?.[1] }}
          className="flex w-full flex-col justify-start p-4 align-top"
        >
          <SheetTitle className="hidden">{t('input')}</SheetTitle>

          <div className="flex w-full justify-between">
            <Button variant={'ghost'} className="ps-0" onClick={onChangeOpen}>
              <ArrowBack />
            </Button>
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="mb-4 h-full bg-transparent p-4 font-bold text-darkHeadline outline-none"
            onKeyDown={handleKeyPress}
          />

          <BaseButton onClick={onGenerate} classNames="font-semibold h-10" disabled={!prompt}>
            <AIStars className="w-[15px]" /> {t('generate')}
          </BaseButton>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ImagePromptSheet;

import { useContext, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import ArrowBack from '@/assets/arrow-back.svg?react';
import MoreText from '@/assets/more-text.svg?react';
import AIStar from '@/assets/star-filled.svg?react';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import ImportedFilesArray from '@/components/ImportedFilesArray/ImportedFilesArray';
import { PromptPageContext } from '@/contexts/PromptPage.context';
import { useTranslation } from 'react-i18next';
import useViewportSize from '@/hooks/useViewportSize';
import ContextModal from '@/components/Modals/ContextModal/ContextModal';
import CreateConfirmationModal from '@/components/Modals/CreateConfirmationModal/CreateConfirmationModal';
// import ImportSelector from "@/components/Selects/ContentGeneratorSelector/ImportSelector";
interface IProps {
  open: boolean;
  onOpenChange: () => void;
  progress: number;
}

const PromptDrawer = ({ open, onOpenChange, progress }: IProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'prompt' });
  const viewportSize = useViewportSize();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    prompt,
    loading,
    setPrompt,
    handleGenerateOutline,
    setShowContextModal,
    showContextModal,
    type,
    showCreateConfirmation,
    setShowCreateConfirmation,
  } = useContext(PromptPageContext);

  const handleClick = () => {
    if (progress < 100) {
      setShowCreateConfirmation(true);
    } else {
      handleGenerateOutline();
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleGenerateOutline();
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
      <SheetContent
        outsideclose="true"
        side="bottom"
        className="flex h-dvh w-full flex-col items-start justify-start bg-lightGrey p-0"
        onOpenAutoFocus={() => {
          setTimeout(() => {
            textareaRef.current?.focus({ preventScroll: true });
          }, 100);
        }}
      >
        <div
          style={{ height: viewportSize?.[1] }}
          className="flex w-full flex-col justify-start p-4 align-top"
        >
          <SheetTitle className="hidden">{t('input')}</SheetTitle>
          <div className="flex w-full justify-between">
            <Button variant={'ghost'} className="ps-0" onClick={onOpenChange}>
              <ArrowBack />
            </Button>
            {type !== 'youtube' && (
              <div className="flex">
                <BaseButton
                  variant="outline"
                  classNames="rounded-full p-1 me-3 size-[48px]"
                  onClick={() => setShowContextModal(!showContextModal)}
                  tooltip={t('moreText')}
                >
                  <MoreText />
                </BaseButton>
                {/* <ImportSelector mobile /> */}
              </div>
            )}
          </div>
          <textarea
            onKeyDown={handleKeyPress}
            value={prompt}
            ref={textareaRef}
            onChange={(e) => {
              setPrompt(e.target.value);
            }}
            className="my-5 h-full rounded-xl p-4 px-3 font-bold text-darkHeadline outline outline-4 outline-[#E5E7EB40] placeholder:bg-white"
          />
          <div className="flex w-full justify-center">
            <ImportedFilesArray loading={loading} />
          </div>
          <BaseButton
            loading={loading}
            onClick={handleClick}
            classNames="font-semibold h-10"
            disabled={!prompt}
          >
            <AIStar className="w-[15px]" /> {t('generate')}
          </BaseButton>
        </div>
        <ContextModal mobile />
        <CreateConfirmationModal
          title={t('improvePromptTitle')}
          description={t('improvePromptDescription')}
          open={showCreateConfirmation}
          onOpenChange={() => setShowCreateConfirmation(false)}
          onAction={handleGenerateOutline}
          prompt={prompt}
          setPrompt={setPrompt}
          mobile
        />
      </SheetContent>
    </Sheet>
  );
};
export default PromptDrawer;

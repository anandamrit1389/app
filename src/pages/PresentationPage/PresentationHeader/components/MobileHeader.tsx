import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import MobileMenu from '@/assets/mobile-menu.svg?react';
import { Button } from '@/components/ui/button';
import LayoutGrid from '@/assets/mobile-preview.svg?react';
import LayoutSlides from '@/assets/mobile-slides.svg?react';
import { useTranslation } from 'react-i18next';
import { PresentationContext } from '@/contexts/Presentation.context';
import { useContext } from 'react';
import { Redo2, Undo2 } from 'lucide-react';

interface IProps {
  onOpenPreview?: () => void;
  showPreview?: boolean;
  setMenuOpen: (val: boolean) => void;
}

const MobileHeader = ({ onOpenPreview, showPreview, setMenuOpen }: IProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });

  const {
    presentation,
    present,
    handleUndoAction,
    handleRedoAction,
    historyIndex,
    history,
    readonly,
  } = useContext(PresentationContext);

  const isGenerating = !presentation?.generationFinished;

  return (
    <div className="border-b-1 flex h-[56px] items-center justify-between border-b border-b-black/[0.1] bg-white p-2 px-3">
      <div className="flex items-center">
        <Button
          variant={'ghost'}
          className="p-3"
          onClick={() => setMenuOpen(true)}
          disabled={isGenerating}
        >
          <MobileMenu />
        </Button>
        <Button
          variant={'ghost'}
          className="p-3"
          onClick={() => onOpenPreview?.()}
          disabled={isGenerating}
        >
          {!showPreview ? <LayoutGrid /> : <LayoutSlides />}
        </Button>
        {/* <p className="p-1 text-[14px] font-semibold">
          {activeSlide?.slideNumber} / {presentation?.slides?.length}
        </p> */}

        {!readonly && (
          <>
            <BaseButton
              variant="ghost"
              onClick={handleUndoAction}
              classNames="p-2"
              disabled={historyIndex === 1 || historyIndex === 0}
            >
              <Undo2 className="size-5 text-darkText" />
            </BaseButton>
            <BaseButton
              variant="ghost"
              onClick={handleRedoAction}
              classNames="p-2"
              disabled={
                !history || history?.length < 1 || historyIndex === (history?.length ?? 0) - 1
              }
            >
              <Redo2 className="size-5 text-darkText" />
            </BaseButton>
          </>
        )}
      </div>
      <div className="flex gap-x-2">
        <BaseButton
          onClick={present}
          classNames="text-white bg-[#111827] hover:bg-[#374151] focus:bg-[#030712]"
          disabled={isGenerating}
        >
          {t('presentMode')}
        </BaseButton>
      </div>
    </div>
  );
};

export default MobileHeader;

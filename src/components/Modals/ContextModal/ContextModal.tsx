import { useContext, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import OutlineInstruction from '@/assets/outline-instructions.svg?react';
import TextContent from '@/assets/text-content.svg?react';
import { PromptPageContext } from '@/contexts/PromptPage.context';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import ArrowBack from '@/assets/arrow-back.svg?react';
import { useTranslation } from 'react-i18next';
import useViewportSize from '@/hooks/useViewportSize';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import EmptySlidesModal from '@/components/Modals/EmptySlidesModal/EmptySlidesModal';
import { Plus, Trash2 } from 'lucide-react';
import DeleteConfirmationDialog from '@/components/Modals/DeleteConfirmationDialog/DeleteConfirmationDialog';

const ContextModal = ({ mobile }: { mobile?: boolean }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'modals' });
  const viewportSize = useViewportSize();

  const isMobile = mobile || (viewportSize && viewportSize[0] < 768);

  const {
    showContextModal,
    selectedSlidesCount,
    setShowContextModal,
    addPromptContext,
    addOutlineInstructions,
    updateSlidesCount,
  } = useContext(PromptPageContext);

  const [instructionWindow, setInstructionWindow] = useState(true);
  const [context, setContext] = useState<string>('');
  const [instructions, setInstructions] = useState<string[]>([]);
  const [showEmptySlidesModal, setShowEmptySlidesModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [slideToDelete, setSlideToDelete] = useState<number | null>(null);

  useEffect(() => {
    return () => {
      setContext('');
      setInstructions([]);
    };
  }, []);

  useEffect(() => {
    setInstructions(Array(selectedSlidesCount).fill(''));
  }, [selectedSlidesCount]);

  const hasEmptyInstructions = () => {
    if (!instructionWindow) return false;

    for (let i = 0; i < instructions.length; i++) {
      const instruction = instructions[i];
      if (!instruction || instruction.trim() === '') {
        return true;
      }
    }
    return false;
  };

  const handleReduceSlides = () => {
    const filledInstructions = instructions.filter(
      (instruction) => instruction && instruction.trim() !== '',
    );
    const newSlidesCount = filledInstructions.length;
    updateSlidesCount(newSlidesCount);
    addPromptContext(context);
    addOutlineInstructions(filledInstructions);
    setShowContextModal(false);
    setContext('');
    setInstructions(filledInstructions); // Preserve the filled instructions
  };

  const handleFillWithContent = () => {
    proceedWithCurrentInstructions();
  };

  const proceedWithCurrentInstructions = () => {
    addPromptContext(context);
    addOutlineInstructions(instructions);
    setShowContextModal(false);
    setContext('');
    setInstructions([]);
  };

  const onAction = () => {
    const hasEmpty = hasEmptyInstructions();

    if (hasEmpty) {
      setShowEmptySlidesModal(true);
      return;
    }
    proceedWithCurrentInstructions();
  };

  const handleClose = () => {
    setShowContextModal(!showContextModal);
    setContext('');
  };

  const handleInputChange = (index: number, value: string) => {
    const updatedInputs = [...instructions];
    updatedInputs[index] = value;
    setInstructions(updatedInputs);
  };

  const handleAddSlide = () => {
    setInstructions([...instructions, '']);
    updateSlidesCount(instructions.length + 1);
  };

  const handleRemoveSlideClick = (index: number) => {
    if (instructions[index] && instructions[index].trim() !== '') {
      setSlideToDelete(index);
      setShowDeleteConfirmation(true);
    } else {
      handleRemoveSlide(index);
    }
  };

  const handleRemoveSlide = (index: number) => {
    if (instructions.length > 1 && index !== 0) {
      const updatedInstructions = [...instructions];
      updatedInstructions.splice(index, 1);
      setInstructions(updatedInstructions);
      updateSlidesCount(updatedInstructions.length);
    }
    setSlideToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setSlideToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (slideToDelete !== null) {
      handleRemoveSlide(slideToDelete);
    }
    setShowDeleteConfirmation(false);
  };

  if (isMobile) {
    return (
      <Sheet modal={false} open={showContextModal} onOpenChange={handleClose}>
        <SheetContent
          hideclose="true"
          className="flex w-full flex-col items-start p-0"
          side="right"
        >
          <div
            style={{ height: viewportSize?.[1] }}
            className="flex w-full flex-col items-start p-4"
          >
            <Button variant={'ghost'} className="ps-0" onClick={handleClose}>
              <ArrowBack />
            </Button>
            <SheetTitle className="w-full text-center text-[24px] font-bold">
              {t('addYourText')}
            </SheetTitle>
            <div className="mb-4 flex justify-center mt-4">
              <div className="flex w-full h-10 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setInstructionWindow(true)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-md font-medium transition-colors whitespace-nowrap ${
                    instructionWindow ? 'bg-white font-medium' : 'text-gray-600 hover:text-gray-700'
                  }`}
                >
                  <OutlineInstruction />
                  <span>{t('slideBySlide')}</span>
                </button>
                <button
                  onClick={() => setInstructionWindow(false)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-md font-medium transition-colors whitespace-nowrap ${
                    !instructionWindow
                      ? 'bg-white font-medium'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <TextContent />
                  <span>{t('pasteTextContent')}</span>
                </button>
              </div>
            </div>
            {instructionWindow && (
              <div className="mb-4 text-center text-sm text-gray-600 px-1 leading-relaxed">
                {t('gotYourContentReady')}
              </div>
            )}
            <div className="max-h-full w-full grow overflow-y-auto">
              {instructionWindow ? (
                <div>
                  {instructions.map((instruction, index) => (
                    <div key={index} className="mb-4 relative">
                      <Label className="mb-2 block text-sm font-medium text-darkHeadline">
                        {index === 0 ? t('coverSlide') : `${t('slide')} ${index + 1}`}
                      </Label>
                      <div className="flex items-center"> 
                        <Input
                          className="h-12 w-full rounded-md border border-lightGreyPress p-2 placeholder:text-disabled focus:border-darkText"
                          value={instruction}
                          onChange={(e) => handleInputChange(index, e.target.value)}
                          placeholder={index === 0 ? t('slideText2') : t('slideText3')}
                        />
                        {index !== 0 && (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="ml-2" 
                            onClick={() => handleRemoveSlideClick(index)}
                          >
                            <Trash2 className="size-5 text-gray-500" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    className="w-full mt-2 flex items-center justify-center gap-2"
                    onClick={handleAddSlide}
                  >
                    <Plus className="h-4 w-4" />
                    <span>{t('addSlide')}</span>
                  </Button>
                </div>
              ) : (
                <Textarea
                  className="h-[240px] w-full rounded-md bg-lightGrey p-3"
                  value={context}
                  onChange={(e) => {
                    setContext(e.target.value);
                  }}
                  placeholder={t('pasteYourText')}
                />
              )}
            </div>
            <div className="mt-4 flex w-full justify-end gap-x-4">
              <BaseButton variant="default" onClick={onAction} classNames="text-white w-full h-10">
                {t('import')}
              </BaseButton>
            </div>
          </div>
        </SheetContent>

        <EmptySlidesModal
          open={showEmptySlidesModal}
          onOpenChange={setShowEmptySlidesModal}
          onReduceSlides={handleReduceSlides}
          onFillWithContent={handleFillWithContent}
        />

        <DeleteConfirmationDialog
          open={showDeleteConfirmation}
          onOpenChange={setShowDeleteConfirmation}
          slideNumber={slideToDelete}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </Sheet>
    );
  }

  return (
    <Dialog modal open={showContextModal} onOpenChange={handleClose}>
      <DialogContent className="gap-0 px-4 py-6 w-[95vw] max-w-[746px] h-[85vh] sm:px-6 sm:py-8 sm:w-[90vw] md:w-[80vw] lg:w-[70vw] xl:max-w-[746px]">
        <DialogTitle className="mb-2 text-center text-[24px] font-bold">
          {t('addYourText')}
        </DialogTitle>

        <div className="mb-4 flex justify-center">
          <div className="flex w-full h-10 bg-gray-100 rounded-lg p-1 max-w-[400px]">
            <button
              onClick={() => setInstructionWindow(true)}
              className={`flex-1 flex items-center justify-center gap-1 py-1 px-1 rounded-md text-xs font-medium transition-colors ${
                instructionWindow ? 'bg-white font-medium' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <OutlineInstruction />
              <span>{t('slideBySlide')}</span>
            </button>
            <button
              onClick={() => setInstructionWindow(false)}
              className={`flex-1 flex items-center justify-center gap-1 py-1 px-1 rounded-md text-xs font-medium transition-colors ${
                !instructionWindow ? 'bg-white font-medium' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <TextContent />
              <span>{t('pasteContent')}</span>
            </button>
          </div>
        </div>
        {instructionWindow && (
          <div className="mb-4 text-center text-sm text-gray-600 px-6 leading-relaxed">
            {t('gotYourContentReady')}
          </div>
        )}

        <div className="overflow-y-auto p-4">
          {instructionWindow ? (
            <div>
              {instructions.map((instruction, index) => (
                <div key={index} className="mb-4 relative">
                  <Label className="mb-2 block text-sm font-medium text-darkHeadline">
                    {index === 0 ? t('coverSlide') : `${t('slide')} ${index + 1}`}
                  </Label>
                  <div className="flex items-center">
                    <Textarea
                      className="h-12 w-full rounded-md border border-lightGreyPress p-2 placeholder:text-disabled focus:border-darkText"
                      value={instruction}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      placeholder={index === 0 ? t('slideText2') : t('slideText3')}
                    />
                    {index !== 0 && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="ml-2" 
                        onClick={() => handleRemoveSlideClick(index)}
                      >
                        <Trash2 className="size-5 text-gray-500" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <Button 
                variant="outline" 
                className="w-full mt-2 flex items-center justify-center gap-2"
                onClick={handleAddSlide}
              >
                <Plus className="h-4 w-4" />
                <span>{t('addSlide')}</span>
              </Button>
            </div>
          ) : (
            <div>
              <Textarea
                className="w-full rounded-md border border-[#F9F9FA] bg-lightGrey p-3 h-[220px] sm:h-[250px] lg:h-[280px]"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder={t('pasteYourText')}
              />
            </div>
          )}
        </div>

        <div className="mt-8 flex h-10 justify-end gap-x-2">
          <BaseButton variant="outline" onClick={handleClose}>
            {t('cancel')}
          </BaseButton>
          <BaseButton variant="default" onClick={onAction} classNames="text-white">
            {t('done')}
          </BaseButton>
        </div>
      </DialogContent>

      <EmptySlidesModal
        open={showEmptySlidesModal}
        onOpenChange={setShowEmptySlidesModal}
        onReduceSlides={handleReduceSlides}
        onFillWithContent={handleFillWithContent}
      />

      <DeleteConfirmationDialog
        open={showDeleteConfirmation}
        onOpenChange={setShowDeleteConfirmation}
        slideNumber={slideToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </Dialog>
  );
};

export default ContextModal;

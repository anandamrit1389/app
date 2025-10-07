import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useContext, useEffect, useState, useMemo } from 'react';
import { PresentationContext } from '@/contexts/Presentation.context';
import { useTranslation } from 'react-i18next';
import AIStars from '@/assets/ai-stars.svg?react';
import useViewportSize from '@/hooks/useViewportSize';
import useMobile from '@/hooks/useMobile';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import ArrowBack from '@/assets/arrow-back.svg?react';
import { Button } from '@/components/ui/button';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import SlideTypeSelector from './SlideTypeSelector';
import Loader from '@/assets/loader-color.svg?react';
import { PlusIcon, X } from 'lucide-react';
import { AuthContext } from '@/providers/auth.provider';
import { FREE_PLAN_SLIDES_COUNT } from '@/helpers/constants/subscription.const';
import { useSubscriptionModal } from '@/hooks/useSubscriptionModal';
import UpgradeModal from '@/components/Modals/UpgradeModal/UpgradeModal';
import CreditCost from '@/components/CreditCost/CreditCost';
import { CreditAction } from '@/interfaces/IPricing';
import CoinFilledWhite from '@/assets/coin-filled-white.svg?react';
import ImportDataModal from '@/components/Modals/ImportDataModal/ImportDataModal';
import { ChartData } from '@/components/PresentationEditor/SlideFactory/Slides/ChartSlide';
import ExcelIcon from '@/assets/excel.svg?react';
import DriveIcon from '@/assets/drive.svg?react';
import CreditsLeft from '@/components/CreditCost/CreditsLeft';
import { useCredits } from '@/hooks/useCredits';

interface FileTag {
  type: string;
  name: string;
}

const AddNewSlideDialog = ({
  isOpen,
  open,
  onChangeOpen,
  index,
  addAfterSlide,
  setAddAfterSlide,
  onMenuClose,
}: {
  isOpen: boolean;
  open: boolean;
  onChangeOpen: (open: boolean) => void;
  index?: number | null;
  addAfterSlide?: boolean;
  setAddAfterSlide?: (val: boolean) => void;
  onMenuClose?: () => void;
}) => {
  const { loading, addSlide, presentation, activeSlide } = useContext(PresentationContext);
  const { hasActiveSubscription } = useContext(AuthContext);
  
  const credits = useCredits();
  const viewportSize = useViewportSize();
  const isMobile = useMobile();
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });
  const { onOpenChange } = useSubscriptionModal();

  const [prompt, setPrompt] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>(isMobile ? 'ask-ai' : '');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showImportDataModal, setShowImportDataModal] = useState(false);
  const [importedChartData, setImportedChartData] = useState<ChartData[][] | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileTag | null>(null);

  const hasReachedMaxSlides = useMemo(() => {
    if (!presentation?.slides) return false;

    const regularSlides = presentation.slides.filter(
      (slide) => !['content-slide', 'closing-slide'].includes(slide.slideType),
    ).length;

    if (!hasActiveSubscription) {
      return regularSlides >= FREE_PLAN_SLIDES_COUNT;
    }

    return regularSlides >= 30;
  }, [presentation?.slides, hasActiveSubscription]);

  const handleAddSlide = async () => {
    try {
      const finalPrompt = prompt;
      const slideTypeToUse = selectedType;

      if (index !== undefined && index !== null && addAfterSlide) {
        await addSlide({
          type: slideTypeToUse,
          prompt: finalPrompt,
          index,
          importedChartData: importedChartData || undefined,
        });
        await new Promise((resolve) => setTimeout(resolve, 100));
      } else {
        await addSlide({
          type: slideTypeToUse,
          prompt: finalPrompt,
          importedChartData: importedChartData || undefined,
        });
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      onChangeOpen(false);
      setSelectedType('');
      setPrompt('');
      setIsDialogOpen(false);
      setSelectedFile(null);
      setImportedChartData(null);
    } catch (error) {
      console.error('Error adding slide:', error);
    }
  };

  const handleAddFreeSlide = async () => {
    try {
      if (index !== undefined && index !== null && addAfterSlide) {
        await addSlide({ type: selectedType, index, title: prompt });
        await new Promise((resolve) => setTimeout(resolve, 100));
      } else {
        await addSlide({ type: selectedType, title: prompt });
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      onChangeOpen(false);
      setPrompt('');
      setIsDialogOpen(false);
      setSelectedType('');
    } catch (error) {
      console.error('Error adding slide:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleGenerate = () => {
    handleAddSlide();
    onChangeOpen(false);
    onMenuClose?.();
  };

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    if (type === 'chart-slide') {
      setShowImportDataModal(true);
    } else {
      setIsDialogOpen(!isDialogOpen);
    }
  };

  const handleImportedData = (data: ChartData[][], fileInfo?: { type: string; name: string }) => {
    if (data.length > 0) {
      setImportedChartData(data);
    }
    setShowImportDataModal(false);
    setSelectedType('chart-slide');

    if (fileInfo) {
      setSelectedFile({ type: fileInfo.type, name: fileInfo.name });
    }
    if (!isMobile) {
      setIsDialogOpen(true);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const FileTagComponent = ({ file, onRemove }: { file: FileTag; onRemove: () => void }) => {
    return (
      <div className="flex items-center border border-secondary-400 gap-2 px-3 py-1.5 bg-[var(--secondary-200)] rounded-full">
        <div className="flex items-center gap-2">
          {file.type === 'Excel' ? (
            <ExcelIcon className="size-5" />
          ) : file.type === 'Google Sheet' ? (
            <DriveIcon className="size-5" />
          ) : null}
          <span className="text-sm">{file.name}</span>
        </div>
        <button onClick={onRemove} className="text-gray-500 hover:text-gray-700">
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  };

  useEffect(() => {
    if (index && setAddAfterSlide) {
      setAddAfterSlide(false);
    }
  }, [activeSlide]);

  useEffect(() => {
    if (isOpen) {
      setPrompt('');
      setSelectedFile(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedType === 'chart-slide') {
      setShowImportDataModal(true);
    }
  }, [selectedType]);

  if (hasActiveSubscription && hasReachedMaxSlides) {
    return null;
  }

  if (isMobile) {
    return (
      <>
        {isOpen && hasReachedMaxSlides ? (
          <UpgradeModal
            open={true}
            onOpenChange={onChangeOpen}
            onUpgradeClick={() => {
              setShowUpgradeModal(false);
              onOpenChange();
            }}
          />
        ) : (
          <>
            {loading ? (
              <div className="flex justify-center items-center h-dvh bg-white">
                <Loader className="animate-spin size-10" />
              </div>
            ) : (
              <>
                <Sheet open={isOpen} onOpenChange={onChangeOpen}>
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
                        <Button
                          variant={'ghost'}
                          className="ps-0"
                          onClick={() => onChangeOpen(false)}
                        >
                          <ArrowBack />
                        </Button>
                        <div className="flex">
                          <SlideTypeSelector
                            selectedType={selectedType}
                            setSelectedType={setSelectedType}
                            mobile={isMobile}
                            hasReachedMaxSlides={hasReachedMaxSlides}
                            setShowUpgradeModal={() => setShowUpgradeModal(true)}
                            open={open}
                            setOpen={onChangeOpen}
                          />
                        </div>
                      </div>

                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="mb-4 h-full bg-transparent p-4 font-bold text-darkHeadline outline-none"
                        placeholder={t('additionalInstructions')}
                      />
                      <div className="flex flex-col gap-2">
                        {selectedFile && (
                          <div className="flex flex-wrap gap-2 border-t pt-2">
                            <FileTagComponent file={selectedFile} onRemove={handleRemoveFile} />
                          </div>
                        )}

                        <BaseButton
                          loading={loading}
                          onClick={handleGenerate}
                          classNames="font-semibold h-10"
                          disabled={!prompt}
                        >
                          <AIStars className="w-[15px]" /> {t('generate')}
                          <CreditCost
                            action={CreditAction.GENERATE_CARD}
                            icon={<CoinFilledWhite />}
                            containerClassName={`border-l border-l-lightGrey/30`}
                            costClassName={`text-lightGrey`}
                          />
                        </BaseButton>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                <ImportDataModal
                  isOpen={showImportDataModal}
                  setIsOpen={setShowImportDataModal}
                  onClose={() => {
                    setShowImportDataModal(false);
                  }}
                  onDataImport={handleImportedData}
                />
              </>
            )}
          </>
        )}
      </>
    );
  }

  return (
    <>
      <>
        {!showUpgradeModal ? (
          <>
            {isDialogOpen ? (
              <>
                <BaseButton variant="outline" classNames="w-full h-8 gap-1">
                  <PlusIcon className="size-4" /> {t('addSlide')}
                </BaseButton>
                <Dialog
                  open={isOpen}
                  onOpenChange={() => {
                    onChangeOpen(!isOpen);
                    setIsDialogOpen(false);
                    setSelectedType('');
                  }}
                >
                  <DialogContent
                    hideclose={true}
                    className={`max-w-[50%] border-0 bg-transparent shadow-none outline-none transition-all ${
                      loading ? 'w-[72px]' : 'w-full'
                    }`}
                  >
                    <DialogTitle className="hidden">{t('addNewSlide')}</DialogTitle>
                    <div className="flex flex-col rounded-2xl bg-white p-4 outline outline-4 outline-white/[0.25] gap-2">
                      <div className="flex flex-row">
                        {!loading && (
                          <>
                            <input
                              value={prompt}
                              onChange={(e) => {
                                setPrompt(e.target.value);
                              }}
                              onKeyDown={handleKeyPress}
                              placeholder={
                                selectedType !== 'free-slide' ? t('additionalInstructions') : t('enterTitle')
                              }
                              className="w-full font-semibold outline-none outline-0"
                            />
                          </>
                        )}
                        <div className="flex justify-end items-center">
                          <BaseButton
                            loading={loading}
                            disabled={!prompt}
                            onClick={
                              selectedType !== 'free-slide' ? handleAddSlide : handleAddFreeSlide
                            }
                            variant="default"
                            classNames="px-3 py-2 rounded-lg"
                          >
                            <AIStars className="size-5" />
                            {t('generate')}
                            {selectedType !== 'free-slide' && (
                              <CreditCost
                                action={CreditAction.GENERATE_CARD}
                                icon={<CoinFilledWhite />}
                                containerClassName="border-l border-l-lightGrey/30"
                                costClassName="text-lightGrey"
                              />
                            )}
                          </BaseButton>
                        </div>
                      </div>
                      {selectedFile && !loading && (
                        <div className="flex flex-wrap gap-2 mb-2 border-t pt-2">
                          <FileTagComponent file={selectedFile} onRemove={handleRemoveFile} />
                        </div>
                      )}
                    </div>
                    {!loading && 
                      <div className="flex items-center justify-end mr-6">
                        <CreditsLeft credits={credits} />
                      </div>
                    }
                  </DialogContent>
                </Dialog>
              </>
            ) : (
              isOpen && (
                <>
                  <SlideTypeSelector
                    selectedType={selectedType}
                    setSelectedType={handleTypeSelect}
                    mobile={isMobile}
                    hasReachedMaxSlides={hasReachedMaxSlides}
                    setShowUpgradeModal={() => setShowUpgradeModal(true)}
                    open={open}
                    setOpen={onChangeOpen}
                  />

                  <ImportDataModal
                    isOpen={showImportDataModal}
                    setIsOpen={setShowImportDataModal}
                    onClose={() => {
                      setShowImportDataModal(false);
                    }}
                    onDataImport={handleImportedData}
                  />
                </>
              )
            )}
          </>
        ) : (
          <UpgradeModal
            open={showUpgradeModal}
            onOpenChange={setShowUpgradeModal}
            onUpgradeClick={() => {
              setShowUpgradeModal(false);
              onOpenChange();
            }}
          />
        )}
      </>
    </>
  );
};

export default AddNewSlideDialog;

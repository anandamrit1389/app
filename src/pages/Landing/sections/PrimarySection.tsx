import { useTranslation } from 'react-i18next';
import bgImage from '@/assets/landing/bg-inabit-1.png';
import { useState } from 'react';
import DesktopDemoPresentationPreview from './components/DesktopDemoPresentationPreview/DesktopDemoPresentationPreview';
import DemoPrettifyPresentationContent from '@/components/Modals/PrettifyPresentationModal/DemoPrettifyPresentationContent';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { ISlide } from '@/interfaces/ISlides';
import AnimatedText from './components/AnimatedText/AnimatedText';
import { useEnhancementFinalization } from '@/hooks/useEnhancementFinalization';
import { analyticsService } from '@/helpers/services/AnalyticsService';

const PrimarySectionV3 = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'landing' });

  const [showPrettifyResult, setShowPrettifyResult] = useState(false);
  const [generatedPresentation, setGeneratedPresentation] = useState<ISlide[] | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const { handeAddEnhanceFile } = useEnhancementFinalization();

  const handleOutlineSuccess = () => {
    setShowPrettifyResult(true);
  };

  const handleSuccess = (prettifyResponse: ISlide[]) => {
    setShowPrettifyResult(true);
    setGeneratedPresentation(prettifyResponse);
    setUploadedFile;
  };

  const handleHidePreview = () => {
    setShowPrettifyResult(false);
    setGeneratedPresentation(null);
    setUploadedFile(undefined);
    setLoading(false);
  };

  const handleFileUpload = (file: File) => {
    analyticsService.landingPageEnhanceStart();
    setUploadedFile(file);
    handeAddEnhanceFile(file);
  };

  const handleLoading = (isLoading: boolean) => {
    setLoading(isLoading);
  };

  return (
    <section
      className="flex w-full items-center py-20 md:py-[100px] lg:items-start"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="mx-auto flex w-full max-w-[1060px] flex-col items-center justify-between gap-6 px-4 md:flex-row md:items-start">
        <div className="flex w-full max-w-[554px] flex-col text-center md:text-left">
          <p className="mb-2 text-[12px] font-semibold uppercase tracking-mini text-darkText tablet:mb-4 small-desktop:mb-6 desktop:mb-6">
            {t('heroTagline')}
          </p>
          <h1 className="mb-4 text-[40px] font-semibold leading-none md:text-[56px] lg:text-[65px] small-desktop:mb-6">
            <span className="text-darkHeadline">{t('heroTitle1')}</span> <AnimatedText />
          </h1>
          <p className="text-[22px] leading-[32px] text-darkHeadline">{t('heroDescription')}</p>
        </div>

        <DemoPrettifyPresentationContent
          onOutlineSuccess={handleOutlineSuccess}
          onSuccess={handleSuccess}
          onFileUpload={handleFileUpload}
          onLoading={handleLoading}
          loading={loading}
        />

        <Sheet open={showPrettifyResult} onOpenChange={setShowPrettifyResult}>
          <SheetContent
            outsideclose="true"
            side="bottom"
            className="flex h-[95%] justify-center rounded-t-xl"
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <DesktopDemoPresentationPreview
              onPrev={handleHidePreview}
              slides={generatedPresentation || []}
              uploadedFile={uploadedFile}
            />
          </SheetContent>
        </Sheet>
      </div>
    </section>
  );
};

export default PrimarySectionV3;

import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { PresentationContext } from '@/contexts/Presentation.context';
import { ExternalLink, VideoIcon } from 'lucide-react';
import { useContext, useCallback } from 'react';
import PPTX from '@/assets/pptx-icon.svg?react';
import PDF from '@/assets/pdf-icon.svg?react';
import Slides from '@/assets/slides-icon.svg?react';
import { useTranslation } from 'react-i18next';
import Print from '@/assets/print.svg?react';
import ExportItem from './ExportItem';
import VideoOptions from './VideoOptions';
import { AuthContext } from '@/providers/auth.provider';
import { useSubscriptionModal } from '@/hooks/useSubscriptionModal';
import { getUniqueFontsFromSchema } from '@/helpers/utils/fonst';

const ExportTab = () => {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });
  const isPro = user?.subscription?.ownedSubscription?.status === 'active';

  const {
    fontFamily,
    onExport,
    exportingPDF,
    exportingPPTX,
    exportingSlides,
    exportingVideo,
    exportingPDFForPrint,
    extraFonts,
    presentationFonts,
    isExporting,
  } = useContext(PresentationContext);

  const { onOpenChange } = useSubscriptionModal();

  // Memoized handlers for better performance
  const handleExport = useCallback(
    (type: string) => {
      onExport(type);
    },
    [onExport],
  );

  const handleVideoExport = useCallback(
    (withVoiceOver: boolean) => {
      // Pass voice over preference to the export function
      onExport(`video-${withVoiceOver ? 'voice' : 'no-voice'}`);
    },
    [onExport],
  );

  const handleProFeature = useCallback(
    (featureType: string) => {
      if (!isPro) {
        onOpenChange();
      } else {
        handleExport(featureType);
      }
    },
    [isPro, onOpenChange, handleExport],
  );

  const fontScheme = presentationFonts.concat(extraFonts).find((shema) => shema.id === fontFamily);
  const uniqueFonts = fontScheme ? getUniqueFontsFromSchema(fontScheme) : [];

  const handleFontClick = useCallback((link: string) => {
    window.open(link, 'blank');
  }, []);

  return (
    <div className="w-full">
      <div className="flex w-full flex-col">
        {/* Header Section */}
        <div className="mb-6">
          <h3 className="mb-2 text-2xl font-bold text-darkHeadline">{t('export')}</h3>
          {isExporting ? (
            <p className="text-[14px] text-darkText">{t('saveTip')}</p>
          ) : (
            <p className="text-[14px] text-darkText">{t('presentationNewFormat')}</p>
          )}
        </div>

        {/* Export Options Section */}
        <div className="border-black/08 mb-6 flex flex-col gap-1 border-b pb-6">
          {/* PDF Export */}
          <ExportItem
            title={t('adobePdf')}
            icon={<PDF className="size-10" />}
            onClick={() => handleExport('pdf')}
            loading={exportingPDF}
            disabled={isExporting}
          />

          {/* Google Slides Export */}
          <ExportItem
            title={t('googleSlides')}
            icon={<Slides className="size-10" />}
            onClick={() => handleProFeature('slides')}
            loading={exportingSlides}
            isPro={isPro}
            disabled={isExporting}
          />

          {/* PowerPoint Export */}
          <ExportItem
            title={t('powerpoint')}
            icon={<PPTX className="size-10" />}
            onClick={() => handleProFeature('pptx')}
            loading={exportingPPTX}
            isPro={isPro}
            disabled={isExporting}
          />

          {/* Video Export with Options */}
          <ExportItem
            title={t('video')}
            icon={<VideoIcon width={20} height={20} />}
            onClick={() => handleProFeature('video')}
            loading={exportingVideo}
            isPro={isPro}
            disabled={isExporting}
            hasOptions={isPro}
            options={
              <VideoOptions
                onExport={handleVideoExport}
                loading={exportingVideo}
                credits={user?.credits}
              />
            }
          />

          {/* Print Export */}
          <ExportItem
            title={t('print')}
            icon={<Print className="size-10" />}
            onClick={() => handleExport('print')}
            loading={exportingPDFForPrint}
            disabled={isExporting}
          />
        </div>

        {/* Fonts Section */}
        <div className="mb-4">
          <p className="font-semibold text-darkText">{t('fontsDownload')}</p>
          <p className="text-base text-darkText">{t('fontsTip')}</p>
        </div>

        {/* Font Download Buttons */}
        <div className="flex gap-2">
          {!!uniqueFonts &&
            Object.entries(uniqueFonts).map(([key, font]) => (
              <BaseButton
                key={key}
                classNames={`p-2 px-3 font-family-${fontFamily}`}
                onClick={() => handleFontClick(font.link)}
                variant="outline"
              >
                <ExternalLink />
                <div>{font.label}</div>
              </BaseButton>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ExportTab;

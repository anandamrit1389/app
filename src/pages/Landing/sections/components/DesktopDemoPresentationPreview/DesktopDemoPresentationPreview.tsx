import useLocaleNavigate from '@/hooks/useLocaleNavigate';
import { ISlide } from '@/interfaces/ISlides';
import { useTranslation } from 'react-i18next';

import ActionButtons from './ActionButtons';
import Header from './Header';
import SlideGrid from './SlideGrid';
import FileTag from './FileTag';
import { useContext } from 'react';
import { PrettifyContext } from '@/contexts/Prettify.context';

interface DesktopDemoPresentationPreviewProps {
  onPrev: () => void;
  slides: ISlide[];
  uploadedFile?: File;
}

function DesktopDemoPresentationPreview({
  onPrev,
  slides,
  uploadedFile,
}: DesktopDemoPresentationPreviewProps) {
  const navigate = useLocaleNavigate();
  const { t } = useTranslation('translation', {
    keyPrefix: 'desktopDemoPresentationPreview',
  });
  const { theme } = useContext(PrettifyContext);

  const handleAuth = () => navigate('/signup');

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <Header title={t('title')} description={t('description')} emphasis={t('emphasis')} />

      {uploadedFile && <FileTag file={uploadedFile} onRemove={onPrev} />}

      <SlideGrid slides={slides} theme={theme} />

      <ActionButtons
        onTryAgain={onPrev}
        onSignUp={handleAuth}
        tryAgainText={t('buttons.tryAgain')}
        signUpText={t('buttons.signUp')}
      />
    </div>
  );
}

export default DesktopDemoPresentationPreview;

import { useContext, useEffect } from 'react';
import { PresentationContext } from '@/contexts/Presentation.context';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useParams } from 'react-router-dom';
import useMobile from '@/hooks/useMobile';

import MobileEditor from './Editors/MobileEditor/MobileEditor';
import { AnalyticsContext } from '@/contexts/Analytics.context';
import { useSlideAnalytics } from '@/hooks/useSlideAnalytics';
import DesktopContainer from './Editors/DesktopEditor/DesktopContainer';

const PresentationContainer = () => {
  const isMobile = useMobile();
  const [lang, presentationId] = useQueryParams(['lang', 'presentationId']);
  const { alias } = useParams();

  const { getPresentation, setSelectedLanguage } = useContext(PresentationContext);
  const analyticsContext = useSlideAnalytics();

  useEffect(() => {
    if (!presentationId && !alias) return;

    if (alias) {
      getPresentation(alias);
    } else {
      getPresentation(presentationId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presentationId, alias]);

  useEffect(() => {
    if (lang) {
      setSelectedLanguage(lang);
    }
  }, [lang]);

  if (isMobile) {
    return (
      <AnalyticsContext.Provider value={analyticsContext}>
        <MobileEditor />
      </AnalyticsContext.Provider>
    );
  }

  return (
    <AnalyticsContext.Provider value={analyticsContext}>
      <DesktopContainer />
    </AnalyticsContext.Provider>
  );
};

export default PresentationContainer;

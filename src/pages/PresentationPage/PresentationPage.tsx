import { PresentationContext } from '@/contexts/Presentation.context';
import PresentationContainer from './PresentationContainer';
import { usePresentation } from '@/hooks/usePresentation';
import './PresentationPage.css';
import FeedbackDialog from '@/components/Dialogs/FeedbackDialog';

const PresentationPage = () => {
  const presentationContext = usePresentation();

  return (
    <PresentationContext.Provider value={presentationContext}>
      <PresentationContainer />
      <FeedbackDialog
        isOpen={presentationContext.showFeedbackModal}
        onClose={presentationContext.closeFeedbackModal}
        presentationId={presentationContext.feedbackPresentationId}
      />
    </PresentationContext.Provider>
  );
};

export default PresentationPage;

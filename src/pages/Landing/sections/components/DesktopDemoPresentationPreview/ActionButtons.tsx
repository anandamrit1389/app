import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { analyticsService } from '@/helpers/services/AnalyticsService';

function ActionButtons({
  onTryAgain,
  onSignUp,
  tryAgainText,
  signUpText,
}: {
  onTryAgain: () => void;
  onSignUp: () => void;
  tryAgainText: string;
  signUpText: string;
}) {
  const handleTryAgain = () => {
    analyticsService.landingPageTryAgain();
    onTryAgain();
  };

  const handleSignUp = () => {
    analyticsService.landingPagePreviewContinue();
    onSignUp();
  };

  return (
    <div className="flex items-center gap-2">
      <BaseButton onClick={handleTryAgain} variant="outline" classNames="w-[180px]">
        {tryAgainText}
      </BaseButton>
      <BaseButton onClick={handleSignUp} classNames="w-[180px]">
        {signUpText}
      </BaseButton>
    </div>
  );
}

export default ActionButtons;

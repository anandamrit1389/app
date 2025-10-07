import { useContext } from 'react';
import { PresentationContext } from '@/contexts/Presentation.context.ts';
import AiStars3 from '@/assets/ai-stars-3.svg?react';
import { SURPRISE_ME_IMAGE_PROMPT } from '@/helpers/constants/prompt.const';
import { useTranslation } from 'react-i18next';

const SurpriseMe = ({ onSetPrompt }: { onSetPrompt: (prompt: string) => void }) => {
  const { activeImage, activeSlide } = useContext(PresentationContext);
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });

  const handleSurpriseMe = () => {
    if (!activeImage?.slideId) return;
    const surprisePrompt = SURPRISE_ME_IMAGE_PROMPT(activeImage.keywords || activeSlide?.title);
    onSetPrompt(surprisePrompt);
  };

  return (
    <div>
      <div
        className="cursor-pointer p-2 [&>svg]:w-6 [&>svg]:h-6 flex items-center text-xs gap-2"
        onClick={handleSurpriseMe}
      >
        {t('surpriseMe')}
        <AiStars3 />
      </div>
    </div>
  );
};

export default SurpriseMe;

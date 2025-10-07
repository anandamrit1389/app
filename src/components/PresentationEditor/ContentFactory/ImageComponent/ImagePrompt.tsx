import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import FloatingContainer from '@/components/FloatingContainer/FloatingContainer';
import { Input } from '@/components/ui/input';
import Plane from '@/assets/plane.svg?react';
import AiStars from '@/assets/ai-stars-1.svg?react';

interface IProps {
  menuPosition: { x: number; y: number };
  showPromptInput: boolean;
  setShowPromptInput: (val: boolean) => void;
  promptInput: string;
  setPromptInput: (prompt: string) => void;
  handleAIRequest: () => void;
}

const ImagePrompt = ({
  menuPosition,
  showPromptInput,
  setShowPromptInput,
  promptInput,
  setPromptInput,
  handleAIRequest,
}: IProps) => {
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAIRequest();
    }
  };

  return (
    <FloatingContainer
      x={menuPosition.x}
      y={menuPosition.y}
      isOpen={showPromptInput}
      onClose={() => setShowPromptInput(false)}
    >
      <div className="flex items-center rounded-full bg-white p-1 ps-4 shadow-lg">
        <AiStars className="w-10" />
        <Input
          className="rounded-none border-0 text-[#505050] outline-none outline-0 focus-visible:ring-0"
          value={promptInput}
          onChange={(e) => setPromptInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <div className="h-8 border-l border-l-lightGrey"></div>
        <BaseButton
          variant="ghost"
          classNames="rounded-full font-normal text-[#505050]"
          onClick={() => setShowPromptInput(false)}
        >
          Cancel
        </BaseButton>
        <BaseButton
          variant="default"
          classNames="rounded-full p-3"
          disabled={!promptInput}
          onClick={() => handleAIRequest()}
        >
          <Plane />
        </BaseButton>
      </div>
    </FloatingContainer>
  );
};

export default ImagePrompt;

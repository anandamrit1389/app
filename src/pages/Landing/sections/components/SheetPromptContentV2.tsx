import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { useTranslation } from 'react-i18next';
import { ChangeEvent, useRef, useState } from 'react';
import useLocaleNavigate from '@/hooks/useLocaleNavigate';
import AiStars3 from '@/assets/ai-stars-3.svg?react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { DEFAULT_SLIDES_COUNT, shufflePrompts } from '@/helpers/constants/prompt.const';
import { analyticsService } from '@/helpers/services/AnalyticsService';
import {
  getLandingPromptShuffle,
  getLandingPromptSignup,
  getLandingPromptWrite,
} from '@/helpers/utils/storage';

function SheetPromptContentV2() {
  const { t } = useTranslation('translation', {
    keyPrefix: 'sheetPromptContent',
  });
  const [prompt, setPrompt] = useState('');
  const navigate = useLocaleNavigate();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleLogin = async () => {
    if (prompt.length === 0) {
      textareaRef.current?.focus();
      return;
    }

    sessionStorage.setItem(
      'demo',
      JSON.stringify({
        prompt,
        language: 'english',
        slidesCount: DEFAULT_SLIDES_COUNT,
        textAmount: 'keynote',
      }),
    );

    if (!getLandingPromptSignup()) {
      analyticsService.landingPromptSignup();
    }

    navigate('/login');
  };

  const handleShuffle = async () => {
    const prompt = shufflePrompts[Math.floor(Math.random() * shufflePrompts.length)];
    setPrompt(prompt);

    if (!getLandingPromptShuffle()) {
      analyticsService.landingPromptShufle();
    }
  };

  const handlePromptUpdate = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);

    if (!getLandingPromptWrite()) {
      analyticsService.landingPromptWrite();
    }
  };

  const progress = Math.min(prompt.length * 2, 100);

  return (
    <div className="flex size-full flex-col items-center justify-center">
      <div className="mt-2 w-full max-w-[754px]">
        <BaseButton
          variant="ghost"
          classNames="mb-2 ml-auto p-0 hover:bg-transparent focus:bg-transparent text-darkText font-normal"
          onClick={handleShuffle}
          type="button"
        >
          {t('shufflePrompt')} <AiStars3 />
        </BaseButton>
        <div
          className={cn(
            'items-center shadow-[0_11px_77px_0_rgba(0,0,0,0.12)] relative flex w-full justify-between gap-3 md:gap-6 lg:gap-12 rounded-2xl bg-white py-2 pl-3 md:pl-6 pr-3 md:pr-4 outline outline-4 outline-[#E5E7EB25] transition-all duration-1000',
            progress ? 'pb-5' : 'pb-2',
          )}
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={prompt}
            onChange={handlePromptUpdate}
            placeholder={t('promptPlaceholderMobile')}
            className={cn(
              'max-h-44 h-full grow resize-none text-sm font-semibold text-darkHeadline outline-none outline-0 placeholder:font-semibold placeholder:text-disabled placeholder:opacity-60 md:text-base bg-white',
            )}
          />
          <BaseButton
            onClick={handleLogin}
            classNames="px-3 h-10 z-10"
            tooltipClassNames="mb-4 shrink"
          >
            {t(prompt ? 'signUpButton' : 'tryNow')}
          </BaseButton>
          <div className="absolute inset-x-0 bottom-3 mx-auto w-full max-w-[95%]">
            <Progress
              value={progress}
              className={cn(
                'h-[2px] bg-lightGreyPress transition-opacity duration-200 ease-out',
                progress ? 'opacity-100' : 'opacity-0',
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SheetPromptContentV2;

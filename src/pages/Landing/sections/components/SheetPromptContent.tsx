import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import InabitLogo from '@/assets/logo-inabit-color.svg?react';
import SlidesCountSelector from '@/components/DrawersAndSheets/PresentationOutlineDrawer/SlidesCountSelector/SlidesCountSelector';
import TextAmountSelector from '@/components/Selects/ContentGeneratorSelector/TextAmountSelector';
import LanguageSelector from '@/components/DrawersAndSheets/PresentationOutlineDrawer/LanguageSelector/LanguageSelector';
import useLocaleNavigate from '@/hooks/useLocaleNavigate';
import AiStars3 from '@/assets/ai-stars-3.svg?react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import PromptTip from '@/components/common/AppSidebar/PromptTip/PrompotTip';
import { DEFAULT_SLIDES_COUNT, shufflePrompts } from '@/helpers/constants/prompt.const';
import useMobile from '@/hooks/useMobile';
import { analyticsService } from '@/helpers/services/AnalyticsService';

function SheetPromptContent() {
  const { t } = useTranslation('translation', {
    keyPrefix: 'sheetPromptContent',
  });
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('english');
  const [textAmount, setTextAmount] = useState('keynote');
  const [selectedSlidesCount, setSelectedSlidesCount] = useState(DEFAULT_SLIDES_COUNT);
  const isMobile = useMobile();
  const navigate = useLocaleNavigate();

  const updateSlidesCount = (count: number) => {
    setSelectedSlidesCount(count);
  };

  const handleLogin = async () => {
    analyticsService.landingPageSignup();
    sessionStorage.setItem(
      'demo',
      JSON.stringify({
        prompt,
        language,
        slidesCount: selectedSlidesCount,
        textAmount,
      }),
    );
    navigate('/login');
  };

  const handleShuffle = async () => {
    const prompt = shufflePrompts[Math.floor(Math.random() * shufflePrompts.length)];
    setPrompt(prompt);
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
  };

  const progress = Math.min(prompt.length * 2, 100);

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <InabitLogo className="size-[96px]" />
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
            'relative pb-4 flex w-full justify-between gap-3 md:gap-6 lg:gap-12 rounded-xl bg-white py-2 pl-3 md:pl-6 pr-3 md:pr-4 outline outline-4 outline-[#E5E7EB25] transition-all duration-1000',
          )}
        >
          <textarea
            rows={1}
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
            }}
            placeholder={isMobile ? t('promptPlaceholderMobile') : t('promptPlaceholderDesktop')}
            className={cn(
              'max-h-44 grow resize-none text-sm font-semibold text-darkHeadline outline-none outline-0 placeholder:font-semibold placeholder:text-disabled placeholder:opacity-60 md:text-base',
              progress ? 'pb-10' : 'pb-1 ',
            )}
          />
          <BaseButton
            onClick={handleLogin}
            classNames="px-3 h-10 z-10"
            tooltipClassNames="mb-4 shrink"
          >
            {t('signUpButton')}
          </BaseButton>
          <div className="absolute inset-x-0 bottom-4 mx-auto w-full max-w-[95%]">
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
      <div className="mt-6 flex flex-wrap gap-3">
        <SlidesCountSelector
          mobile={isMobile}
          onTogglePricingPlansModal={() => {}}
          updateSlidesCount={updateSlidesCount}
          selectedSlidesCount={selectedSlidesCount}
          triggerClassName="order-2 md:order-1"
        />
        <TextAmountSelector
          mobile={isMobile}
          textAmount={textAmount}
          setTextAmount={setTextAmount}
          triggerClassName="order-3 md:order-2"
        />
        <LanguageSelector
          lang={language}
          onChange={handleLanguageChange}
          mobile={isMobile}
          triggerClassName="order-1 md:order-3"
        />
      </div>
      <div className="mt-8 max-w-[537px] text-center text-xs text-[#11111160]">
        <PromptTip />
      </div>
    </div>
  );
}

export default SheetPromptContent;

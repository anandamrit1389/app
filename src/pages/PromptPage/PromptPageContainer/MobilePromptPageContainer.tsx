import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import ArrowBack from '@/assets/arrow-back.svg?react';
import InabitLogo from '@/assets/logo-inabit-color.svg?react';
import { PromptPageContext } from '@/contexts/PromptPage.context';
import { useContext, useState } from 'react';
import PromptDrawer from '../PromptDrawer/PromptDrawer';
import { Button } from '@/components/ui/button';
import DashboardHeader from '@/pages/Dashboard/DashboardHeader/DashboardHeader';
import MobileMenu from '@/pages/Dashboard/Menu/MobileMenu/MobileMenu';
import PresentationOutlineDrawer from '@/components/DrawersAndSheets/PresentationOutlineDrawer/PresentationOutlineDrawer';
import { useTranslation } from 'react-i18next';
import LocaleLink from '@/components/Locales/LocaleLink/LocaleLink';
import LanguageSelector from '@/components/DrawersAndSheets/PresentationOutlineDrawer/LanguageSelector/LanguageSelector';
import SlidesCountSelector from '@/components/DrawersAndSheets/PresentationOutlineDrawer/SlidesCountSelector/SlidesCountSelector';
import { useSubscriptionModal } from '@/hooks/useSubscriptionModal';
import TextAmountSelector from '@/components/Selects/ContentGeneratorSelector/TextAmountSelector';
import TemplateDrawer from '@/components/DrawersAndSheets/TemplateDrawer/TemplateDrawer';
import ImageStyleDrawer from '@/components/DrawersAndSheets/ImageStyleDrawer/ImageStyleDrawer';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';

const MobilePromptPageContainer = () => {
  const {
    prompt,
    type,
    language,
    handleLanguageChange,
    textAmount,
    setTextAmount,
    updateSlidesCount,
    selectedSlidesCount,
  } = useContext(PromptPageContext);
  const [showPromptInput, setShowPromptInput] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { t } = useTranslation('translation', { keyPrefix: 'prompt' });

  const { onOpenChange } = useSubscriptionModal();

  const progress = Math.min(prompt.length * 2, 100);

  return (
    <div>
      <DashboardHeader 
        onOpenMenu={() => {
          setMenuOpen(!menuOpen);
        }}
      />
      <MobileMenu
        menuOpen={menuOpen}
        onOpenChange={() => setMenuOpen(!menuOpen)}
      />
      <LocaleLink to="/dashboard" className="fixed left-3 top-16">
        <BaseButton variant="ghost">
          <ArrowBack />
        </BaseButton>
      </LocaleLink>

      <div className="flex h-dvh flex-col items-center justify-center bg-lightGrey px-6 pt-16">
        <InabitLogo className="size-[96px]" />

        <Button
          variant="ghost"
          className="relative my-6 h-auto w-full justify-start overflow-hidden rounded-xl bg-white px-3 py-4 outline outline-4 outline-[#E5E7EB40] md:overflow-auto"
          onClick={() => setShowPromptInput(!showPromptInput)}
        >
          {prompt ? (
            <p className="max-h-36 overflow-y-auto whitespace-pre-wrap text-left">{prompt}</p>
          ) : (
            <p className="italic text-grey">
              {t(type === 'youtube' ? 'youtubePlaceholder' : 'placeholderMobile')}
            </p>
          )}

          {type !== 'youtube' && (
            <div className="absolute inset-x-0 bottom-2 mx-auto mt-4 w-full max-w-[95%]">
              <Progress
                value={progress}
                className="h-1 bg-lightGreyPress transition-all duration-300 ease-out"
              />
            </div>
          )}
        </Button>

        <div className={`flex w-full flex-col justify-between gap-3`}>
          <div className="flex flex-wrap gap-3">
            <SlidesCountSelector
              mobile
              onTogglePricingPlansModal={onOpenChange}
              updateSlidesCount={updateSlidesCount}
              selectedSlidesCount={selectedSlidesCount}
            />
            <LanguageSelector mobile lang={language} onChange={handleLanguageChange} />
            {/* <ImageSourceSelector mobile /> */}
            <TextAmountSelector mobile textAmount={textAmount} setTextAmount={setTextAmount} />
          </div>
        </div>

        {type !== 'youtube' && (
          <div>
            <p className="pt-8 text-center text-chineseBlack opacity-60">
              <span>{t('tips')}! </span>
              <span>{t('goodPrompt')} </span>
              <Link to="https://www.inabit.ai/en/notifications/1" className="underline">
                {t('readMore')}
              </Link>
            </p>
          </div>
        )}
      </div>

      <PromptDrawer
        open={showPromptInput}
        onOpenChange={() => setShowPromptInput(!showPromptInput)}
        progress={progress}
      />

      <TemplateDrawer mobile />
      <PresentationOutlineDrawer mobile />
      <ImageStyleDrawer />
    </div>
  );
};

export default MobilePromptPageContainer;

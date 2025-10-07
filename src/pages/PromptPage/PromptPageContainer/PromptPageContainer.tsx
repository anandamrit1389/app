import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import PresentationOutlineDrawer from '@/components/DrawersAndSheets/PresentationOutlineDrawer/PresentationOutlineDrawer';
import { PromptPageContext } from '@/contexts/PromptPage.context';
import { AuthContext } from '@/providers/auth.provider';
import ChevronLeft from '@/assets/chevron-left.svg?react';
import { useContext, useState } from 'react';
import DashboardHeader from '@/pages/Dashboard/DashboardHeader/DashboardHeader';

import InabitLogo from '@/assets/logo-inabit-color.svg?react';
import AIStar from '@/assets/star-filled.svg?react';
import MoreText from '@/assets/more-text.svg?react';
import UploadIcon from '@/assets/upload-icon.svg?react';
import TextRecoginitionIcon from '@/assets/text-recognition.svg?react';

import ImportedFilesArray from '@/components/ImportedFilesArray/ImportedFilesArray';
import { Trans, useTranslation } from 'react-i18next';
import LocaleLink from '@/components/Locales/LocaleLink/LocaleLink';
import LanguageSelector from '@/components/DrawersAndSheets/PresentationOutlineDrawer/LanguageSelector/LanguageSelector';
import SlidesCountSelector from '@/components/DrawersAndSheets/PresentationOutlineDrawer/SlidesCountSelector/SlidesCountSelector';
import { useSubscriptionModal } from '@/hooks/useSubscriptionModal';
//import ImportSelector from "@/components/Selects/ContentGeneratorSelector/ImportSelector";
import TextAmountSelector from '@/components/Selects/ContentGeneratorSelector/TextAmountSelector';
import TemplateDrawer from '@/components/DrawersAndSheets/TemplateDrawer/TemplateDrawer';
import ImageStyleDrawer from '@/components/DrawersAndSheets/ImageStyleDrawer/ImageStyleDrawer';
import CreateConfirmationModal from '@/components/Modals/CreateConfirmationModal/CreateConfirmationModal';
import UpgradeModal from '@/components/Modals/UpgradeModal/UpgradeModal';
import { Progress } from '@/components/ui/progress';
import ContextModal from '@/components/Modals/ContextModal/ContextModal';
import UpgradeAccessModal from '@/components/Modals/UpgradeAccessModal/UpgradeAccessModal';
import PromptTip from '@/components/common/AppSidebar/PromptTip/PrompotTip';

const PromptPageContainer = () => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showUpgradeAccessModal, setShowUpgradeAccessModal] = useState(false);
  const { t } = useTranslation('translation', { keyPrefix: 'prompt' });
  const { onOpenChange } = useSubscriptionModal();

  const {
    loading,
    handleGenerateOutline,
    setPrompt,
    setShowContextModal,
    showContextModal,
    prompt,
    type,
    language,
    handleLanguageChange,
    showCreateConfirmation,
    setShowCreateConfirmation,
    textAmount,
    setTextAmount,
    updateSlidesCount,
    selectedSlidesCount,
    workspace,
  } = useContext(PromptPageContext);

  const { user } = useContext(AuthContext);

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleClick();
    }
  };

  const handleClick = () => {
    if ((user?.presentationLimit ?? 0) + (user?.extraPresentationLimit ?? 0) <= 0) {
      setShowUpgradeAccessModal(true);
      return;
    }
    if (progress < 100 && type !== 'youtube') {
      setShowCreateConfirmation(true);
    } else {
      handleGenerateOutline();
    }
  };

  const progress = Math.min(prompt.length * 2, 100);

  const backPath =
    !workspace || workspace === 'personal' ? '/dashboard' : `/dashboard/${workspace}`;

  return (
    <>
      <DashboardHeader />
      <LocaleLink to={backPath} className="fixed left-10 top-24">
        <BaseButton variant="ghost">
          <ChevronLeft /> {t('backBtn')}
        </BaseButton>
      </LocaleLink>
      <div className="flex h-screen flex-col items-center justify-center bg-lightGrey pt-16">
        <InabitLogo className="size-[96px]" />
        <div
          className={`relative mt-[40px] flex items-start justify-center transition-all duration-1000 ${
            loading
              ? 'w-[76px] max-w-[76px] bg-transparent'
              : 'w-2/3 max-w-[800px] bg-white outline outline-4 outline-[#E5E7EB40]'
          } rounded-xl py-2 pe-4 ${progress && type !== 'youtube' && 'pb-8'}`}
        >
          {!loading && (
            <>
              <textarea
                rows={1}
                value={prompt}
                onKeyDown={handleKeyPress}
                onChange={(e) => {
                  setPrompt(e.target.value);
                }}
                placeholder={t(type === 'youtube' ? `youtubePlaceholder` : `placeholder2`)}
                className={`max-h-44 resize-none pt-3 font-semibold text-darkHeadline outline-none outline-0 placeholder:font-normal placeholder:italic placeholder:text-chineseBlack placeholder:opacity-60 ${
                  loading ? 'w-0 px-0' : 'w-full px-6'
                }`}
              />
              {type !== 'youtube' && (
                <>
                  <BaseButton
                    variant="outline"
                    classNames="rounded-full p-0 me-1 h-[48px] aspect-square"
                    onClick={() => setShowContextModal(!showContextModal)}
                    tooltip={t('moreText')}
                    tooltipClassNames="mb-4"
                  >
                    <MoreText />
                  </BaseButton>
                  {/* <ImportSelector /> */}
                </>
              )}
            </>
          )}
          <BaseButton
            variant="loading"
            loading={loading}
            onClick={handleClick}
            disabled={!prompt}
            tooltip={t('generate')}
            classNames="p-0 h-[48px] aspect-square"
            tooltipClassNames="mb-4"
          >
            <AIStar />
          </BaseButton>

          {type !== 'youtube' && !loading && (
            <div className="absolute inset-x-0 bottom-4 mx-auto w-full max-w-[95%]">
              <Progress
                value={progress}
                className={`h-[2px] bg-lightGreyPress transition-opacity delay-500 duration-300 ease-out ${
                  progress ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </div>
          )}
        </div>

        <ImportedFilesArray loading={loading} />
        <div className={`mt-6 flex gap-3 transition-all ${loading ? 'opacity-0' : 'opacity-100'}`}>
          <SlidesCountSelector
            onTogglePricingPlansModal={onOpenChange}
            updateSlidesCount={updateSlidesCount}
            selectedSlidesCount={selectedSlidesCount}
          />
          {type !== 'speaker' && (
            <TextAmountSelector textAmount={textAmount} setTextAmount={setTextAmount} />
          )}
          <LanguageSelector lang={language} onChange={handleLanguageChange} />
        </div>

        {type !== 'youtube' && !loading && (
          <div className="mx-auto mt-10 flex max-w-[546px] items-center justify-center text-center text-[12px] text-chineseBlack opacity-60">
            {progress < 100 ? (
              <PromptTip />
            ) : (
              <p className="flex flex-wrap items-center justify-center gap-1 text-chineseBlack">
                <span className="font-bold">{t('tips')} 2! </span>
                <Trans
                  i18nKey="tips2"
                  t={t}
                  components={{
                    TextRecognitionIcon: (
                      <span>
                        <TextRecoginitionIcon className="mx-1 flex" />
                      </span>
                    ),
                    UploadIcon: <UploadIcon className="mx-2 flex" />,
                  }}
                />
              </p>
            )}
          </div>
        )}
      </div>
      <TemplateDrawer />
      <ImageStyleDrawer />
      <PresentationOutlineDrawer />

      <ContextModal />
      <CreateConfirmationModal
        title={t('improvePromptTitle')}
        description={t('improvePromptDescription')}
        open={showCreateConfirmation}
        onOpenChange={() => setShowCreateConfirmation(false)}
        onAction={handleGenerateOutline}
        prompt={prompt}
        setPrompt={setPrompt}
      />
      <UpgradeAccessModal
        open={showUpgradeAccessModal}
        onOpenChange={setShowUpgradeAccessModal}
        onUpgradeClick={() => {
          setShowUpgradeAccessModal(false);
          onOpenChange();
        }}
      />
      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        onUpgradeClick={() => {
          setShowUpgradeModal(false);
          onOpenChange();
        }}
      />
    </>
  );
};

export default PromptPageContainer;

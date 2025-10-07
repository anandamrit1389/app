import { useContext, useEffect, useState } from 'react';
import { PersonalContext } from '@/contexts/Dashboard.context';
import useMobile from '@/hooks/useMobile';
import Sort from '@/assets/sort.svg?react';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { Trans, useTranslation } from 'react-i18next';
import {
  AddNewButton,
  AddNewYoutubeButton,
  PrettifyButton,
  SortOptions,
  PresentationCard,
} from '@/pages/Dashboard/components/presentations';
import useInfinityScroll from '@/hooks/useInfinityScroll';
import DashboardActions from '../DashboardActions/DashboardActions';
import { AuthContext } from '@/providers/auth.provider';
import { UpgradeCard } from '@/pages/Dashboard/components/common';
import AddTranslationModal, {
  AddLanguageModalState,
} from '@/components/Modals/AddTranslationModal';
import { languages } from '@/helpers/constants/languages.const';
import Hide from '@/components/services/Hide';
import LocaleLink from '@/components/Locales/LocaleLink/LocaleLink';
import useLocaleNavigate from '@/hooks/useLocaleNavigate';
import { useSubscriptionModal } from '@/hooks/useSubscriptionModal';
import UpgradeAccessModal from '@/components/Modals/UpgradeAccessModal/UpgradeAccessModal';

const initAddLanguageModalState: AddLanguageModalState = {
  isModalShow: false,
  presentationId: null,
  languagesToSelect: languages,
  presentationLink: '',
};

const Workspace = () => {
  const isMobile = useMobile();
  const navigate = useLocaleNavigate();

  const {
    presentations,
    // getPresentations,
    loading,
    loadingMore,
    activeSort,
    setActiveSort,
    loadMorePresentations,
    presentationsExist,
    handleDuplicatePresentation,
    handleDeletePermanently,
    handleFavourite,
    handleDeletePresentation,
    handleRestorePresentation,
    handleMoveToTeam,
  } = useContext(PersonalContext);
  const { hasActiveSubscription, user } = useContext(AuthContext);

  const { handleScroll } = useInfinityScroll({
    loadMore: loadMorePresentations,
  });

  const [showSort, setShowSort] = useState(false);
  const [addLanguageModalState, setAddLanguageModalState] = useState(initAddLanguageModalState);
  const [showUpgradeAccessModal, setShowUpgradeAccessModal] = useState(false);
  const { onOpenChange } = useSubscriptionModal();

  const { t } = useTranslation('translation', { keyPrefix: 'dashboard' });

  const handleOpenAddLanguageModal = (
    presentationId: string,
    existedLangs: string[],
    presentationLink: string,
  ) => {
    setAddLanguageModalState({
      isModalShow: true,
      presentationId,
      presentationLink,
      languagesToSelect: languages.filter((lang) => !existedLangs.includes(lang.value)),
    });
  };

  const handleCloseAddLanguageModal = () => {
    setAddLanguageModalState(initAddLanguageModalState);
  };

  const hasReachedLimit = (user?.presentationLimit ?? 0) + (user?.extraPresentationLimit ?? 0) <= 0;

  const handleAddPresentationClick = (link: string) => {
    if (hasReachedLimit) {
      setShowUpgradeAccessModal(true);
      return;
    }
    navigate(link);
  };

  useEffect(() => {
    setShowSort(false);
  }, [activeSort]);

  if (isMobile && !presentations.length && !loading && !presentationsExist) {
    return (
      <div className="h-full bg-empty-dashboard-mobile bg-cover">
        <div className="flex h-3/5 flex-col items-center justify-center gap-6 p-6">
          <div className="flex flex-col items-center gap-1">
            <h1 className="gradient-text text-[12px] font-semibold uppercase tracking-[3px]">
              {t('welcome')}
            </h1>
            <p className="text-center text-[28px] font-bold">{t('emptyDashboardDescription')}</p>
          </div>
          <div className="flex w-full flex-col gap-2 ">
            <PrettifyButton workspace="personal" onAddClick={handleAddPresentationClick} />
            <AddNewButton workspace="personal" onAddClick={handleAddPresentationClick} />
            <UpgradeAccessModal
              open={showUpgradeAccessModal}
              onOpenChange={setShowUpgradeAccessModal}
              onUpgradeClick={() => {
                setShowUpgradeAccessModal(false);
                onOpenChange();
              }}
            />
          </div>
          <p className="text-[12px] text-darkHeadline">
            <Trans>
              {t('visitInspiration1')}
              <LocaleLink to="/dashboard/inspiration">
                {' '}
                <span className="lowercase underline">{t('inspiration')}</span>{' '}
              </LocaleLink>
              {t('visitInspiration2')}
            </Trans>
          </p>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="h-full overflow-auto p-4" onScroll={handleScroll}>
        {!hasActiveSubscription && (
          <div className="mb-4 mt-2">
            <DashboardActions />
          </div>
        )}

        <h1 className="mb-4 text-[16px] font-semibold">{t('personalWorkspace.title')}</h1>

        <div className="mb-6 flex flex-wrap gap-3">
          <PrettifyButton mobile workspace="personal" onAddClick={handleAddPresentationClick} />
          <AddNewButton mobile workspace="personal" onAddClick={handleAddPresentationClick} />
          <Hide environments={['prod']}>
            <AddNewYoutubeButton
              mobile
              workspace="personal"
              onAddClick={handleAddPresentationClick}
            />
          </Hide>
          <UpgradeAccessModal
            open={showUpgradeAccessModal}
            onOpenChange={setShowUpgradeAccessModal}
            onUpgradeClick={() => {
              setShowUpgradeAccessModal(false);
              onOpenChange();
            }}
          />
        </div>
        <div className="mb-4 flex items-end justify-between pt-2">
          <h1 className="text-[20px] font-semibold">{t('workspace')}</h1>
          <BaseButton variant="outline" onClick={() => setShowSort(!showSort)}>
            <Sort />
            {t('sort')}
          </BaseButton>
        </div>

        <div className="grid grid-cols-2 gap-x-2 gap-y-4">
          {loading
            ? Array.from({ length: 16 }).map((_, index) => (
                <PresentationCard.Skeleton key={`skeleton-${index}`} />
              ))
            : presentations?.map((pres) => {
                return (
                  <PresentationCard
                    key={pres.id}
                    presentation={pres}
                    // onAction={getPresentations}
                    onShowAddLanguageModal={handleOpenAddLanguageModal}
                    onDuplicate={handleDuplicatePresentation}
                    onDeletePermanently={handleDeletePermanently}
                    onDeletePresentation={handleDeletePresentation}
                    onRestorePresentation={handleRestorePresentation}
                    onSwitchFavourite={handleFavourite}
                    onMoveToTeam={handleMoveToTeam}
                    mobile
                  />
                );
              })}

          {false && (
            <div className="absolute bottom-0 right-0">
              <UpgradeCard />
            </div>
          )}
          <AddTranslationModal
            isMobile={isMobile}
            modalState={addLanguageModalState}
            onOpenChange={handleCloseAddLanguageModal}
          />
        </div>
        <SortOptions
          mobile
          menuOpen={showSort}
          onOpenChange={() => setShowSort(!showSort)}
          activeFilter={activeSort}
          setActiveFilter={setActiveSort}
        />
      </div>
    );
  }

  if (!presentations.length && !loading && !presentationsExist) {
    return (
      <div className="h-full bg-empty-dashboard bg-cover">
        <div className="flex h-4/5 flex-col items-center justify-center gap-8 p-6">
          <div className="flex flex-col items-center">
            <h1 className="gradient-text text-[12px] font-semibold uppercase tracking-[3px]">
              {t('welcome')}
            </h1>
            <p className="text-[32px] font-bold">{t('emptyDashboardDescription')}</p>
          </div>
          <div className="flex flex-wrap gap-6">
            <PrettifyButton workspace="personal" onAddClick={handleAddPresentationClick} />
            <AddNewButton workspace="personal" onAddClick={handleAddPresentationClick} />
            <UpgradeAccessModal
              open={showUpgradeAccessModal}
              onOpenChange={setShowUpgradeAccessModal}
              onUpgradeClick={() => {
                setShowUpgradeAccessModal(false);
                onOpenChange();
              }}
            />
          </div>
          <p className="text-sm text-darkHeadline">
            <Trans>
              {t('visitInspiration1')}
              <LocaleLink to="/dashboard/inspiration">
                {' '}
                <span className="lowercase underline">{t('inspiration')}</span>{' '}
              </LocaleLink>
              {t('visitInspiration2')}
            </Trans>
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-full overflow-auto p-6 mt-4" onScroll={handleScroll}>
        {!hasActiveSubscription && (
          <div className="mb-7 mt-2">
            <DashboardActions />
          </div>
        )}
        <h1 className="mb-4 text-[18px] font-semibold">{t('personalWorkspace.title')}</h1>
        <div className="mb-8 flex w-full flex-wrap items-end justify-between gap-x-6 gap-y-8">
          <div className="flex flex-wrap gap-6">
            <PrettifyButton workspace="personal" onAddClick={handleAddPresentationClick} />
            <AddNewButton workspace="personal" onAddClick={handleAddPresentationClick} />
            <Hide environments={['prod']}>
              <AddNewYoutubeButton workspace="personal" onAddClick={handleAddPresentationClick} />
            </Hide>
            <UpgradeAccessModal
              open={showUpgradeAccessModal}
              onOpenChange={setShowUpgradeAccessModal}
              onUpgradeClick={() => {
                setShowUpgradeAccessModal(false);
                onOpenChange();
              }}
            />
          </div>
        </div>
        <div className="flex w-full justify-between mb-4">
          <h1 className="text-[24px] font-semibold">{t('workspace')}</h1>
          <div className="max-w-[200px]">
            <SortOptions activeFilter={activeSort} setActiveFilter={setActiveSort} />
          </div>
        </div>

        {(!presentations || presentations?.length === 0) && !loading && (
          <p className="mt-56 w-full text-center text-tertiaryText">{t('getStarted')}</p>
        )}

        <div className="grid grid-cols-1 gap-x-4 gap-y-8 tablet:grid-cols-2 medium-desktop:grid-cols-3 big-desktop:grid-cols-4 huge-desktop:grid-cols-5">
          {presentations?.map((pres) => (
            <PresentationCard
              key={pres.id}
              presentation={pres}
              // onAction={getPresentations}
              onShowAddLanguageModal={handleOpenAddLanguageModal}
              onDuplicate={handleDuplicatePresentation}
              onDeletePermanently={handleDeletePermanently}
              onDeletePresentation={handleDeletePresentation}
              onRestorePresentation={handleRestorePresentation}
              onSwitchFavourite={handleFavourite}
              onMoveToTeam={handleMoveToTeam}
            />
          ))}

          {false && (
            <div className="absolute bottom-6 right-6">
              <UpgradeCard />
            </div>
          )}

          {(loading || loadingMore) &&
            Array.from({ length: loading ? 12 : 4 }).map((_, index) => (
              <PresentationCard.Skeleton key={`skeleton-${index}`} />
            ))}
          <AddTranslationModal
            isMobile={isMobile}
            modalState={addLanguageModalState}
            onOpenChange={handleCloseAddLanguageModal}
          />
        </div>
      </div>
    </>
  );
};

export default Workspace;

import { Trans, useTranslation } from 'react-i18next';
import LocaleLink from '@/components/Locales/LocaleLink/LocaleLink';
import { TeamContext } from '@/contexts/Dashboard.context';
import { useContext, useEffect, useState } from 'react';
import useMobile from '@/hooks/useMobile';
import useInfinityScroll from '@/hooks/useInfinityScroll';
import { languages } from '@/helpers/constants/languages.const';
import {
  SortOptions,
  PresentationCard,
  PrettifyButton,
  AddNewButton,
  AddNewYoutubeButton,
} from '@/pages/Dashboard/components/presentations';
import AddTranslationModal, {
  AddLanguageModalState,
} from '@/components/Modals/AddTranslationModal';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import Sort from '@/assets/sort.svg?react';
import { useWebSocket } from '@/hooks/useWebSocket';
import Hide from '@/components/services/Hide';
import useLocaleNavigate from '@/hooks/useLocaleNavigate';
import { AuthContext } from '@/providers/auth.provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const initAddLanguageModalState: AddLanguageModalState = {
  isModalShow: false,
  presentationId: null,
  languagesToSelect: languages,
  presentationLink: '',
};

const Team = () => {
  const workspace = 'team';
  const isMobile = useMobile();
  const navigate = useLocaleNavigate();
  const { companyMembershipInfo } = useContext(AuthContext);

  const { socket } = useWebSocket();

  const { t } = useTranslation('translation', { keyPrefix: 'dashboard' });
  const [showSort, setShowSort] = useState(false);

  const [addLanguageModalState, setAddLanguageModalState] = useState(initAddLanguageModalState);

  const {
    activeSort,
    refetch,
    setActiveSort,
    presentations,
    loading,
    loadingMore,
    presentationsExist,
    loadMorePresentations,
    handleDuplicatePresentation,
    handleDeletePermanently,
    handleFavourite,
    handleDeletePresentation,
    handleRestorePresentation,
  } = useContext(TeamContext);

  const { handleScroll } = useInfinityScroll({
    loadMore: loadMorePresentations,
  });

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

  const handleAddPresentationClick = (link: string) => {
    navigate(link);
  };

  useEffect(() => {
    if (!socket) return;

    const silent = () => refetch({ silent: true });
    socket.on('presentation:created', silent);
    socket.on('presentation:updated', silent);
    socket.on('presentation:deleted', silent);

    return () => {
      socket.off('presentation:created', silent);
      socket.off('presentation:updated', silent);
      socket.off('presentation:deleted', silent);
    };
  }, [socket, refetch]);

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
            <PrettifyButton workspace={workspace} onAddClick={handleAddPresentationClick} />
            <AddNewButton workspace={workspace} onAddClick={handleAddPresentationClick} />
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
        <h1 className="mb-4 text-[16px] font-semibold">{t('teamWorkspace.title')}</h1>

        <div className="mb-6 flex flex-wrap gap-3">
          <PrettifyButton mobile workspace={workspace} onAddClick={handleAddPresentationClick} />
          <AddNewButton mobile workspace={workspace} onAddClick={handleAddPresentationClick} />
          <Hide environments={['prod']}>
            <AddNewYoutubeButton
              mobile
              workspace={workspace}
              onAddClick={handleAddPresentationClick}
            />
          </Hide>
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
                    onShowAddLanguageModal={handleOpenAddLanguageModal}
                    onDuplicate={handleDuplicatePresentation}
                    onDeletePermanently={handleDeletePermanently}
                    onDeletePresentation={handleDeletePresentation}
                    onRestorePresentation={handleRestorePresentation}
                    onSwitchFavourite={handleFavourite}
                    mobile
                  />
                );
              })}
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
      <div className="h-full bg-cover">
        <div className="flex h-4/5 flex-col items-center justify-center gap-8 p-6">
          <div className="flex flex-col items-center">
            <h1 className="gradient-text text-[12px] font-semibold uppercase tracking-[3px]">
              {t('welcome')}
            </h1>
            <p className="text-[32px] font-bold">{t('emptyDashboardDescription')}</p>
          </div>
          <div className="flex flex-wrap gap-6">
            <PrettifyButton workspace={workspace} onAddClick={handleAddPresentationClick} />
            <AddNewButton workspace={workspace} onAddClick={handleAddPresentationClick} />
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
        <div className="flex items-center justify-between w-full mb-4">
          <h1 className="text-[18px] font-semibold">{t('teamWorkspace.title')}</h1>
          {companyMembershipInfo?.companyLogo && (
            <div>
              <img className="h-6" src={companyMembershipInfo?.companyLogo} />
            </div>
          )}
        </div>
        <div className="mb-8 flex w-full flex-wrap items-end justify-between gap-x-6 gap-y-8">
          <div className="flex flex-wrap gap-6">
            <PrettifyButton workspace={workspace} onAddClick={handleAddPresentationClick} />
            <AddNewButton workspace={workspace} onAddClick={handleAddPresentationClick} />
            <Hide environments={['prod']}>
              <AddNewYoutubeButton workspace={workspace} onAddClick={handleAddPresentationClick} />
            </Hide>
          </div>
        </div>
        <div className="flex w-full justify-end mb-4">
          <div className="flex items-center gap-4">
            <TooltipProvider delayDuration={200}>
              <div className="flex">
                {companyMembershipInfo?.members.map((m, index) => (
                  <Tooltip key={m.id}>
                    <TooltipTrigger asChild>
                      <Avatar
                        className={`relative size-8 border-2 mb-0 border-white ${index !== 0 ? '-ml-4' : ''}`}
                        onClick={() => {}}
                      >
                        <AvatarImage src={m.imgUrl ?? undefined} alt="@shadcn" />
                        <AvatarFallback className="bg-default-gradient font-semibold text-white">
                          {m.name?.[0]?.toUpperCase() ?? m.email?.[0]?.toUpperCase() ?? '?'}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1F2937] border-none shadow-lg">
                      <p className="text-3 text-white">{m.name ? m.name : m.email}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
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
              onShowAddLanguageModal={handleOpenAddLanguageModal}
              onDuplicate={handleDuplicatePresentation}
              onDeletePermanently={handleDeletePermanently}
              onDeletePresentation={handleDeletePresentation}
              onRestorePresentation={handleRestorePresentation}
              onSwitchFavourite={handleFavourite}
            />
          ))}

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

export default Team;

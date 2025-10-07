import { MoreVertical } from 'lucide-react';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import SlideFactory from '@/components/PresentationEditor/SlideFactory/SlideFactory';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IPresentation } from '@/interfaces/ISlides';
import Trash from '@/assets/trash.svg?react';
import Star from '@/assets/star.svg?react';
import Copy from '@/assets/copy.svg?react';
import Share from '@/assets/share-2.svg?react';
import Lang from '@/assets/message-language.svg?react';
import Team from '@/assets/users-group.svg?react';
import StarFavorite from '@/assets/star-favorite.svg?react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LocaleLink from '@/components/Locales/LocaleLink/LocaleLink';
import useHoverActions from '@/hooks/useHoverActions';
import useMobile from '@/hooks/useMobile';
import { Skeleton } from '@/components/ui/skeleton';
import DeleteConfirmationModal from '@/components/Modals/DeleteConfirmationModal/DeleteConfirmationModal';
import ShareModal from '@/pages/PresentationPage/PresentationHeader/components/ShareModal';
import { LanguagePicker } from '@/pages/Dashboard/components/common';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface IProps {
  presentation: IPresentation;
  onAction?: () => void;
  onDuplicate: (id: string) => void;
  onDeletePresentation: (id: string) => void;
  onRestorePresentation: (id: string) => Promise<void>;
  onDeletePermanently: (id: string) => Promise<void>;
  onSwitchFavourite: (id: string, isFavourite: boolean) => void;
  onMoveToTeam?: (id: string) => void;
  onShowAddLanguageModal: (
    presentationId: string,
    existedLangs: string[],
    presentationLink: string,
  ) => void;
  mobile?: boolean;
}

interface IPresentationActions {
  titleKey: string;
  icon: React.ReactNode;
  function: () => void;
  disabled?: boolean;
}

export const PresentationCard = ({
  presentation,
  onAction,
  mobile,
  onShowAddLanguageModal,
  onDuplicate,
  onDeletePresentation,
  onRestorePresentation,
  onDeletePermanently,
  onSwitchFavourite,
  onMoveToTeam,
}: IProps) => {
  const isMobile = useMobile();
  const navigate = useNavigate();
  const { isHovered, handleMouseEnter, handleMouseLeave } = useHoverActions();
  const [showConfirmation, setShowConfiramtion] = useState(false);
  const { t, i18n } = useTranslation('translation', { keyPrefix: 'dashboard' });
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleShare = () => {
    setIsDropdownOpen(false);
    setIsShareModalOpen(true);
  };

  const handleMoveToTeam = () => {
    setIsDropdownOpen(false);
    if (onMoveToTeam) onMoveToTeam(presentation.id);
  };

  const getPresentationLink = () =>
    presentation.alias
      ? `/presentation/${presentation.alias}?`
      : `/presentation?presentationId=${presentation?.id}&`;

  const handleAddLang = () => {
    setIsDropdownOpen(false);
    if (onShowAddLanguageModal) {
      onShowAddLanguageModal(
        presentation.id,
        [presentation.language, ...presentation.translatedLanguages],
        getPresentationLink(),
      );
    }
  };

  const handleDuplicate = async () => {
    setIsDropdownOpen(false);
    onDuplicate(presentation.id);
    if (!onAction) return;
    onAction();
  };

  const handleSwitchFavourite = () => {
    onSwitchFavourite(presentation.id, !presentation.isFavourite);
    setIsDropdownOpen(false);
  };

  const handleDeleteClick = () => {
    setIsDropdownOpen(false);
    setShowConfiramtion(!showConfirmation);
  };

  const handleDelete = async () => {
    setIsDropdownOpen(false);
    setShowConfiramtion(!showConfirmation);
    onDeletePresentation(presentation.id);
    if (!onAction) return;
    onAction();
  };

  const handleRestore = async () => {
    setIsDropdownOpen(false);
    try {
      await onRestorePresentation(presentation.id);
      if (!onAction) return;
      onAction();
    } catch (error) {
      console.error('Error restoring presentation:', error);
    }
  };

  const handlePermanentDelete = async () => {
    setIsDropdownOpen(false);
    setShowConfiramtion(!showConfirmation);
    await onDeletePermanently(presentation.id);

    if (!onAction) return;
    onAction();
  };

  const handleSelectLang = (lang: string) => {
    navigate(`/${i18n.language}${getPresentationLink()}lang=${lang}`);
  };

  const favouriteKey = presentation.isFavourite
    ? `${presentation.workspace}Workspace.unfavorite`
    : `${presentation.workspace}Workspace.favorite`;

  const actions: IPresentationActions[] = presentation.isDeleted
    ? [
        {
          titleKey: 'restore',
          icon: <Share />,
          function: handleRestore,
        },
        {
          titleKey: 'deletePermanently',
          icon: <Trash className="[&_path]:stroke-[#B12525]" />,
          function: handleDeleteClick,
          disabled: presentation.readonly,
        },
      ]
    : [
        {
          titleKey: 'share',
          icon: <Share />,
          function: handleShare,
          disabled: false,
        },
        {
          titleKey: 'moveToTeam',
          icon: <Team />,
          function: handleMoveToTeam,
          disabled: !onMoveToTeam,
        },
        {
          titleKey: 'addLanguage',
          icon: <Lang />,
          function: handleAddLang,
        },
        {
          titleKey: 'duplicate',
          icon: <Copy />,
          function: handleDuplicate,
        },
        {
          titleKey: favouriteKey,
          icon: <Star />,
          function: handleSwitchFavourite,
        },
        {
          titleKey: 'delete',
          icon: <Trash className="[&_path]:stroke-[#B12525]" />,
          function: handleDeleteClick,
          disabled: presentation.readonly,
        },
      ];

  const containerClasses = [
    'mb-2',
    'aspect-video',
    'bg-pageBg',
    'rounded-xl',
    isMobile ? 'template-selector' : 'selector',
    `theme-${presentation.themeId}`,
    `font-family-${presentation.fontFamily}`,
  ].join(' ');

  const slideClasses = [
    'slide-container',
    'brightness-1',
    'relative',
    'size-full',
    'overflow-hidden',
    'rounded-xl',
    'bg-pageBg',
    'outline',
    'outline-2',
    'outline-lightGrey',
    'transition-all',
    'hover:brightness-75',
  ].join(' ');

  const description =
    (presentation?.slides?.[0].slideType === 'title-slide' && presentation.description) || '';

  return (
    <>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <LocaleLink to={`${getPresentationLink()}lang=${presentation.language}`}>
          <div className={containerClasses}>
            <div className={slideClasses}>
              <SlideFactory slide={presentation?.slides?.[0]} isPreview description={description} />
            </div>
          </div>
        </LocaleLink>
        <div className="flex w-full items-start justify-between">
          <div>
            <LocaleLink
              className="w-full"
              to={`${getPresentationLink()}lang=${presentation.language}`}
            >
              <div className="line-clamp-2 flex items-start gap-1 text-[16px] font-semibold text-darkHeadline">
                <div>{presentation.isFavourite && <StarFavorite />}</div>
                <p>{presentation.title}</p>
              </div>
            </LocaleLink>
            <div className="flex flex-row items-center">
              {!mobile && (
                <>
                  <LocaleLink to={`${getPresentationLink()}lang=${presentation.language}`}>
                    <p className="text-[14px] text-darkText opacity-50">
                      {presentation.numberOfSlides} {t('slides')}
                    </p>
                  </LocaleLink>
                </>
              )}

              {presentation.translatedLanguages &&
                presentation.translatedLanguages.length !== 0 && (
                  <>
                    <span className="mx-2 text-darkText opacity-50">•</span>
                    <LanguagePicker
                      languages={[presentation.language, ...presentation.translatedLanguages]}
                      onSelect={handleSelectLang}
                      label={t('languages')}
                    />
                  </>
                )}
            </div>
          </div>

          <DropdownMenu modal={false} open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger>
              <div
                className={cn(
                  `items-start p-0 transition-all hover:bg-transparent focus:bg-transparent active:bg-transparent opacity-0`,
                  {
                    'opacity-1': isHovered || isMobile,
                  },
                )}
              >
                <MoreVertical className="size-5 text-darkGrey hover:text-black" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex w-[200px] flex-col gap-1 p-2">
              {actions?.map((action) => {
                return (
                  <BaseButton
                    disabled={action.disabled}
                    key={action.titleKey}
                    variant="ghost"
                    onClick={action.function}
                    classNames={`p-2 w-full justify-start items-center font-normal text-[14px] ${
                      action.titleKey === 'delete' ? 'text-[#B12525]' : 'text-[#030712]'
                    }`}
                  >
                    {action.icon} {t(action.titleKey)}
                  </BaseButton>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <ShareModal
        open={isShareModalOpen}
        onOpenChange={() => setIsShareModalOpen(false)}
        readonly={false}
        presentationData={presentation}
        mobile={isMobile}
      />

      <DeleteConfirmationModal
        title={t('deletePresentationModalTitle')}
        description={t('deletePresentationModalDescription')}
        open={showConfirmation}
        onOpenChange={() => setShowConfiramtion(!showConfirmation)}
        onAction={presentation.isDeleted ? handlePermanentDelete : handleDelete}
      />
    </>
  );
};

PresentationCard.Skeleton = () => {
  return (
    <div className="flex flex-col space-y-2">
      <Skeleton className="aspect-video w-full rounded-lg" />
      <div className="space-y-1 px-2">
        <Skeleton className="h-5 w-4/6 rounded" />
        <Skeleton className="h-3 w-1/6 rounded-none" />
      </div>
    </div>
  );
};

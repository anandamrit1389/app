import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { PrettifyButton } from './PrettifyButton';
import { AddNewYoutubeButton } from './AddNewYoutubeButton';
import useLocaleNavigate from '@/hooks/useLocaleNavigate';
import { useContext, useState } from 'react';
import { useSubscriptionModal } from '@/hooks/useSubscriptionModal';
import { AuthContext } from '@/providers/auth.provider';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { useTranslation } from 'react-i18next';
import PlusIcon from '@/assets/plus-sign.svg?react';
import UpgradeAccessModal from '@/components/Modals/UpgradeAccessModal/UpgradeAccessModal';
import useMobile from '@/hooks/useMobile';
import Hide from '@/components/services/Hide';
import { AddNewButton } from './AddNewButton';
import Tag from '@/components/CustomUI/Tag/Tag';

export const AddPresentationMenu = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'dashboard' });
  const isMobile = useMobile();

  const navigate = useLocaleNavigate();
  const { onOpenChange, handleChangeFilter } = useSubscriptionModal();
  const { user, companyMembershipInfo } = useContext(AuthContext);

  const [showUpgradeAccessModal, setShowUpgradeAccessModal] = useState(false);

  const hasReachedLimit = (user?.presentationLimit ?? 0) + (user?.extraPresentationLimit ?? 0) <= 0;

  const handleAddPresentationClick = (link: string, workspace: 'personal' | 'team') => {
    if (hasReachedLimit && workspace !== 'team') {
      setShowUpgradeAccessModal(true);
      return;
    }
    navigate(link);
  };

  const handleTeamClick = () => {
    handleChangeFilter(['business']);
    onOpenChange();
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>
          <BaseButton
            variant="outline"
            classNames="rounded-[56px] mb-2 md:mb-4"
            icon={<PlusIcon strokeWidth="1" />}
          >
            {t('newPresentation')}
          </BaseButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          isInsideDialog={isMobile}
          side="bottom"
          className="flex w-[200px] flex-col gap-1 p-2"
        >
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>{t('addMenu.personal')}</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <PrettifyButton
                asMenuItem
                workspace="personal"
                onAddClick={handleAddPresentationClick}
              />
              <AddNewButton
                asMenuItem
                workspace="personal"
                onAddClick={handleAddPresentationClick}
              />
              <Hide environments={['prod']}>
                <AddNewYoutubeButton
                  asMenuItem
                  workspace="personal"
                  onAddClick={handleAddPresentationClick}
                />
              </Hide>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          {companyMembershipInfo ? (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>{t('addMenu.team')}</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <PrettifyButton
                  asMenuItem
                  workspace="team"
                  onAddClick={handleAddPresentationClick}
                />
                <AddNewButton asMenuItem workspace="team" onAddClick={handleAddPresentationClick} />
                <Hide environments={['prod']}>
                  <AddNewYoutubeButton
                    asMenuItem
                    workspace="team"
                    onAddClick={handleAddPresentationClick}
                  />
                </Hide>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          ) : (
            <DropdownMenuItem
              className="cursor-pointer flex justify-between"
              onClick={handleTeamClick}
            >
              {t('addMenu.team')}
              <Tag
                classNames={
                  'py-[6px] px-2 text-[12px] leading-[12px] bg-[#BD9E60] rounded cursor-pointer'
                }
              >
                {t('bussines')}
              </Tag>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <UpgradeAccessModal
        open={showUpgradeAccessModal}
        onOpenChange={setShowUpgradeAccessModal}
        onUpgradeClick={() => {
          setShowUpgradeAccessModal(false);
          onOpenChange();
        }}
      />
    </>
  );
};

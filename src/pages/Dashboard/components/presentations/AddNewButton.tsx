import { useTranslation } from 'react-i18next';
import NewPresentation from '@/assets/new-presentation.svg?react';
import { NewPresentationButton } from './NewPresentationButton';
import { cn } from '@/lib/utils';

interface IProps {
  asMenuItem?: boolean;
  workspace: 'team' | 'personal';
  mobile?: boolean;
  onAddClick: (link: string, workspace: 'team' | 'personal') => void;
}

export const AddNewButton = ({ mobile, workspace, onAddClick, asMenuItem = false }: IProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'dashboard' });

  const workspaceClassName = {
    team: 'bg-lightGrey hover:bg-lightGreyHover active:bg-lightGreyPress outline-lightGreyPress',
    personal: '',
  };

  const iconWorkspaceClassName = {
    team: '[&_path]:stroke-tertiaryText [&_path]:fill-lightGreyPress',
    personal: '',
  };

  const handleClick = () => {
    onAddClick(`/generate/prompt?workspace=${workspace}`, workspace);
  };

  return (
    <NewPresentationButton
      asMenuItem={asMenuItem}
      mobile={mobile}
      onClick={handleClick}
      title={t('newPresentation')}
      description={t('createWithAI')}
      className={cn(workspaceClassName[workspace], {
        'bg-white hover:bg-[#F6F7F8] focus:bg-lightGreyHover outline-0 outline-none': asMenuItem,
      })}
      icon={<NewPresentation className={iconWorkspaceClassName[workspace]} />}
    />
  );
};

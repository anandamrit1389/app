import { useTranslation } from 'react-i18next';
import Prettify from '@/assets/feature.svg?react';
import { NewPresentationButton } from './NewPresentationButton';
import { cn } from '@/lib/utils';

interface IProps {
  asMenuItem?: boolean;
  mobile?: boolean;
  workspace: 'team' | 'personal';
  onAddClick: (link: string, workspace: 'team' | 'personal') => void;
}

export const PrettifyButton = ({ mobile, workspace, onAddClick, asMenuItem = false }: IProps) => {
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
    onAddClick(`/enhance?workspace=${workspace}`, workspace);
  };

  return (
    <NewPresentationButton
      asMenuItem={asMenuItem}
      mobile={mobile}
      title={t('enhancePresentation')}
      description={t('prettifyButtonDescription')}
      className={cn(workspaceClassName[workspace], {
        'bg-white hover:bg-[#F6F7F8] focus:bg-lightGreyHover outline-0 outline-none': asMenuItem,
      })}
      icon={<Prettify className={iconWorkspaceClassName[workspace]} />}
      onClick={handleClick}
    />
  );
};

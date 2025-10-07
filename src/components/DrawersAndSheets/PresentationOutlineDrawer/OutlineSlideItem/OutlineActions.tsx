import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { IOutlineActions } from '../interfaces/IOutlineActions';
import { useTranslation } from 'react-i18next';
import useMobile from '@/hooks/useMobile';
import classNames from 'classnames';

interface IProps {
  actions: IOutlineActions[];
  onClickItem: (id: string) => void;
  dropdownOpen: boolean;
  setDropdownOpen: (open: boolean) => void;
}

const OutlineActions = ({ actions, onClickItem, dropdownOpen, setDropdownOpen }: IProps) => {
  const isMobile = useMobile();
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger className="mt-2 flex h-6 justify-center rounded-lg pt-1 transition-all hover:bg-lightGrey">
        <MoreVertical className="absolute -right-1 top-4 h-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {actions?.map((action) => {
          if ((action.hideOnMobile && isMobile) || action.hidden) return <></>;

          return (
            <BaseButton
              disabled={action.disabled}
              key={action.titleKey}
              variant="ghost"
              onClick={() => onClickItem(action.id)}
              classNames={classNames(
                'w-full justify-start font-normal text-[14px] text-[#030712] gap-3',
                {
                  'text-[#B12525]': action.id === 'remove',
                },
              )}
            >
              {action.icon} {t(action.titleKey)}
            </BaseButton>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OutlineActions;

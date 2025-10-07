import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { IActions, IBaseMember } from '@/interfaces/common';
import { MoreVertical } from 'lucide-react';
import useHoverActions from '@/hooks/useHoverActions';
import { cn } from '@/lib/utils';

export interface IProps<T extends IBaseMember> {
  member: T;
  actions: IActions<T>[];
  isDisabled: boolean;
}

const MemberItem = <T extends IBaseMember>({ member, actions, isDisabled = false }: IProps<T>) => {
  const { isHovered, handleMouseEnter, handleMouseLeave } = useHoverActions();

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      key={member.id}
      className="mb-2 flex flex-row items-center
                  gap-2 border-b border-solid 
                  border-card-stroke pb-3 pt-2"
    >
      <div className="w-8  flex-none rounded-full">
        <img
          className={cn('rounded-full text-[14px] w-8 h-8', isDisabled && 'opacity-65')}
          src={member.imgUrl}
          alt=""
        />
      </div>
      <div className="grow">
        <h1 className={cn('font-semibold text-darkText text-[14px]', isDisabled && 'opacity-65')}>
          {member.name}
        </h1>
        <p className={cn('text-tertiaryText text-[14px]', isDisabled && 'opacity-65')}>
          {member.email}
        </p>
      </div>
      {!isDisabled && actions.length > 0 && (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger>
            <BaseButton
              variant="ghost"
              size="icon"
              classNames={`transition-all p-0 focus:bg-transparent hover:bg-transparent active:bg-transparent ${
                isHovered ? 'opacity-1' : 'opacity-0'
              }`}
            >
              <MoreVertical className="size-5 text-darkGrey hover:text-black" />
            </BaseButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" className="flex w-[200px] flex-col gap-1 p-2">
            {actions.map((action) => {
              return (
                <BaseButton
                  disabled={action.disabled}
                  key={action.title}
                  variant="ghost"
                  onClick={() => action.function(member)}
                  classNames={`p-2 w-full justify-start items-center font-normal text-[14px] ${
                    action.isDelete ? 'text-[#B12525]' : 'text-[#030712]'
                  }`}
                >
                  {action.icon} {action.title}
                </BaseButton>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default MemberItem;

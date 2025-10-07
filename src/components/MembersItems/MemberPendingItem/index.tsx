import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { IBaseMember } from '@/interfaces/common';
import ClockDisabled from '@/assets/clock-disabled.svg?react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export interface IProps<T extends IBaseMember> {
  member: T;
  onCancel?: (member: T) => void;
  isMobile: boolean;
}

const MemberPendingItem = <T extends IBaseMember>({ member, onCancel, isMobile }: IProps<T>) => {
  const { t } = useTranslation('translation', { keyPrefix: 'common' });
  return (
    <div
      key={member.id}
      className="mb-2 flex w-full flex-row
                items-center justify-between gap-2 rounded border
                border-dashed border-pending px-2 py-[6px]"
    >
      <div className="w-5 flex-none rounded-full ">
        <ClockDisabled />
      </div>
      <div className={cn('grow flex justify-between', { 'flex-col': isMobile })}>
        <div>
          <p className="text-[14px] text-disabled">{member.email}</p>
        </div>
        <div className={cn('', { 'w-2/5': !isMobile })}>
          <div>
            <p className="text-[14px] text-disabled">Pending</p>
          </div>
          <div className=""></div>
        </div>
      </div>
      {onCancel && (
        <BaseButton
          onClick={() => onCancel(member)}
          variant="ghost"
          classNames="px-[12px] py-[8px]"
        >
          {t('cancel')}
        </BaseButton>
      )}
    </div>
  );
};

export default MemberPendingItem;

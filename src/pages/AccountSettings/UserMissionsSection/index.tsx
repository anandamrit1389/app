import { RefObject, useContext, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import useMobile from '@/hooks/useMobile';
import { cn } from '@/lib/utils';
import { UserMission } from '@/interfaces/IUser';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import ProCrown from '@/assets/pro-crown.svg?react';
import { useSubscriptionModal } from '@/hooks/useSubscriptionModal';
import userService from '@/api/userService';
import InviteManyModal from '@/components/Modals/InviteManyModal/InviteManyModal';
import UsersPlus from '@/assets/users-plus.svg?react';
import Image3 from '@/assets/image-3.png';
import { AuthContext } from '@/providers/auth.provider';

interface IProps {
  mission: UserMission;
  sectionRef: RefObject<HTMLDivElement>;
}

const UserMissionsSection = ({ mission, sectionRef }: IProps) => {
  const isMobile = useMobile();
  const { handleRefreshProfile } = useContext(AuthContext);

  const { t } = useTranslation('translation', { keyPrefix: 'account' });

  const [inviteOpen, setInviteOpen] = useState<boolean>(false);

  const handleInviteUser = async (emails: string[], lang: string) => {
    await userService.inviteManyUsers(emails, lang);
    handleRefreshProfile();
  };

  const { onOpenChange } = useSubscriptionModal();

  return (
    <div
      id="user-theme"
      ref={sectionRef}
      className={cn('p-10 bg-white', {
        'px-4 py-6': isMobile,
        'rounded-lg': !isMobile,
      })}
    >
      <div
        className={cn('w-11/12 flex flex-col gap-4', {
          'w-12/12': isMobile,
        })}
      >
        <div className="flex items-center justify-start">
          <BaseButton
            classNames="z-10 uppercase text-[12px] py-1 px-2 bg-[#BD9E60] w-fit flex items-center"
            onClick={onOpenChange}
          >
            <ProCrown />
            {t('proFeature')}
          </BaseButton>
        </div>
        <p className="text-base font-semibold text-darkHeadline">{t('themeTitle')}</p>

        <div className="w-full">
          <div
            className={`flex rounded-lg bg-[#111827] text-white  ${
              isMobile ? 'flex-col-reverse' : 'flex-row'
            }`}
          >
            <div className={`flex flex-col gap-4 py-7 pl-5 pr-16 ${isMobile ? 'w-full' : 'w-3/5'}`}>
              <div className="flex flex-col">
                <p className="mb-2 text-[16px] text-white">
                  <Trans
                    i18nKey={`account.${mission.id}_title`}
                    values={{ count: mission.requiredInvites }}
                    components={{
                      strong: <strong className="font-bold text-[#BD9E60]" />,
                    }}
                  />
                </p>
                <p className="text-xs text-white">{t(`${mission.id}_description`)}</p>
              </div>

              <BaseButton
                icon={<UsersPlus />}
                variant="outline"
                classNames="py-2 px-3 bg-white text-darkGrey border-white w-fit"
                onClick={() => setInviteOpen((o) => !o)}
              >
                {t('inviteNow')}
              </BaseButton>
            </div>

            <div
              className={`flex overflow-hidden ${
                isMobile ? 'h-[160px] w-full rounded-t-lg' : 'w-2/5 rounded-r-lg'
              }`}
            >
              <img
                src={Image3}
                className="size-full object-cover object-center"
                style={{
                  clipPath: 'inset(0px 0px 0px -100px)',
                }}
              />
            </div>
            <InviteManyModal
              open={inviteOpen}
              userMission={mission}
              onOpenChange={() => setInviteOpen(!inviteOpen)}
              onInviteAction={handleInviteUser}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMissionsSection;

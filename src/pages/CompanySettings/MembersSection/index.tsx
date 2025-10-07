import { useTranslation } from 'react-i18next';
import {
  CompanyDetails,
  CompanyInvitedMember,
  CompanyMember,
  CompanyMemberRole,
} from '@/interfaces/companies';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Trash from '@/assets/trash.svg?react';
import UsersPlus from '@/assets/users-plus.svg?react';
import { IActions } from '@/interfaces/common';
import MemberItem from '@/components/MembersItems/MemberItem';
import MemberPendingItem from '@/components/MembersItems/MemberPendingItem';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { useState } from 'react';
import InviteMemberModal from '@/components/Modals/InviteMembersModal';
import CompanyService from '@/api/companyService';
import useMobile from '@/hooks/useMobile';
import { cn } from '@/lib/utils';
import subscriptionService from '@/api/subscriptionService';

interface IProps {
  sectionRef: React.RefObject<HTMLDivElement>;
  companyDetails: CompanyDetails;
  refresh: () => Promise<void>;
}

const MembersSection = ({ sectionRef, companyDetails, refresh }: IProps) => {
  const { t, i18n } = useTranslation('translation', { keyPrefix: 'company' });
  const isMobile = useMobile();

  const [inviteOpen, setInviteOpen] = useState<boolean>(false);

  const handleDelete = async (memmber: CompanyMember) => {
    await CompanyService.deleteMember(memmber.id);
    await refresh();
  };

  const handleCancel = async (memmber: CompanyInvitedMember) => {
    await CompanyService.cancelInvite(memmber.id);
    await refresh();
  };

  const handleUpdateSeats = async () => {
    const res = await subscriptionService.userEditSubscribtion(i18n.language);
    window.location.href = res.url;
  };

  const actions: IActions<CompanyMember>[] = [
    {
      title: t('removeMember'),
      icon: <Trash className="[&_path]:stroke-[#B12525]" />,
      function: handleDelete,
      isDelete: true,
    },
  ];

  const handleInviteUsers = async (emails: string[]) => {
    const resp = await CompanyService.inviteCompanyMembers(emails);
    await refresh();
    return resp;
  };

  return (
    <div id="company-members" ref={sectionRef} className="flex rounded-lg bg-white p-10">
      <div
        className={cn('basis-11/12', {
          'basis-12/12': isMobile,
        })}
      >
        <p className="mb-4 text-base font-semibold text-darkHeadline">{t('membersTitle')}</p>
        <p className="mb-4 text-[14px] text-darkHeadline">{t('membersDescription')}</p>
        <div
          className={cn('flex justify-between items-center mb-4', {
            'flex-col items-start gap-4': isMobile,
          })}
        >
          <div className="grow">
            <p className="text-[14px] font-semibold">
              {t('currentPlanSeats', { count: companyDetails.totalSeats })}
            </p>
          </div>

          <div className="flex gap-2">
            <BaseButton
              classNames="py-2 px-3"
              icon={<UsersPlus />}
              variant="outline"
              onClick={() => setInviteOpen(!inviteOpen)}
            >
              {t('invite', {
                count: companyDetails.remainingSeats,
              })}
            </BaseButton>
            {companyDetails.createdBySource !== 'admin' && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <BaseButton classNames="py-2 px-3" variant="outline">
                    {t('manageSeats')}
                  </BaseButton>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-[440px]">
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('manageSeatsModalTitle')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('manageSeatsModalDescription')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('cancelBtn')}</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-[#111827] hover:bg-darkText focus:bg-darkHeadline"
                      onClick={handleUpdateSeats}
                    >
                      {t('proceedBtn')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
        <div>
          {companyDetails &&
            companyDetails.members.map((member) => (
              <MemberItem
                key={member.id}
                member={member}
                actions={actions}
                isDisabled={member.role === CompanyMemberRole.ADMIN}
              />
            ))}
          {companyDetails &&
            companyDetails.pendingInvites.map((invite) => (
              <MemberPendingItem
                key={invite.id}
                member={invite}
                isMobile={isMobile}
                onCancel={handleCancel}
              />
            ))}
        </div>
      </div>
      <InviteMemberModal
        open={inviteOpen}
        onOpenChange={() => setInviteOpen(!inviteOpen)}
        onInviteAction={handleInviteUsers}
        limitSeatsToAdd={companyDetails.remainingSeats}
      />
    </div>
  );
};

export default MembersSection;

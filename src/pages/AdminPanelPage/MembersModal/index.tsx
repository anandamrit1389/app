import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SkippedUser } from '@/interfaces/companies';
import { useTranslation } from 'react-i18next';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import UsersPlus from '@/assets/users-plus.svg?react';
import InviteMemberModal from '@/components/Modals/InviteMembersModal';
import { PendingMembersSection } from './PendingMembersSection';
import { MembersSection } from './MembersSection';
import AdminCompanyService from '@/api/adminCompany.service';

interface ModalData {
  id: string;
  title: string;
  remainingSeats: number;
}

interface IProps {
  isAddMemberAllowed?: boolean;
  isModalOpen: boolean;
  onModalOpenChange: () => void;
  modalData: ModalData;
}

export const MembersModal = ({
  isAddMemberAllowed = false,
  isModalOpen,
  onModalOpenChange,
  modalData,
}: IProps) => {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);

  const { t } = useTranslation('translation', { keyPrefix: 'adminPanel.membersModal' });

  const handleClose = () => {
    onModalOpenChange();
  };

  const handleInviteUsers = async (emails: string[]): Promise<SkippedUser[]> => {
    const resp = await AdminCompanyService.inviteCompanyMembers(modalData.id, emails);
    setInviteOpen(false);
    setRefreshTick((t) => t + 1);
    return resp;
  };

  return (
    <Dialog onOpenChange={handleClose} open={isModalOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{modalData?.title || ''} </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {isAddMemberAllowed && (
          <BaseButton
            classNames="py-2 px-3"
            size="lg"
            icon={<UsersPlus />}
            variant="outline"
            disabled={!modalData.remainingSeats}
            onClick={() => setInviteOpen(!inviteOpen)}
          >
            {t('invite', {
              count: modalData.remainingSeats,
            })}
          </BaseButton>
        )}
        <MembersSection companyId={modalData.id} refreshTick={`${refreshTick}`} />
        <PendingMembersSection companyId={modalData.id} refreshTick={`${refreshTick}`} />
        <InviteMemberModal
          open={inviteOpen}
          onOpenChange={() => setInviteOpen(!inviteOpen)}
          onInviteAction={handleInviteUsers}
          limitSeatsToAdd={modalData.remainingSeats}
        />
      </DialogContent>
    </Dialog>
  );
};

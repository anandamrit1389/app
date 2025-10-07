import React, { useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import UserService from '@/api/userService';
import { AuthContext } from '@/providers/auth.provider';
import { publishFormatDate } from '@/helpers/utils/date';

interface AcceptedInvitation {
  email: string;
  acceptedAt: string;
}

interface AcceptedInvitationsListProps {
  invitations?: AcceptedInvitation[];

}

const AcceptedInvitationsList: React.FC<AcceptedInvitationsListProps> = ({
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'invite_many_modal' });
  const { user } = useContext(AuthContext);
const [invitations, setInvitations] = useState<AcceptedInvitation[]>([]);
const getData = async () => {
try{
  if (user?.id) {
    const  data = await UserService.getAcceptedInvitationsByUserId(user.id)
    setInvitations(data.data);
  }
  } catch (error) {
    console.error('Error fetching accepted invitations:', error);
  }
}
useEffect(() => {
  getData();
}, [user?.id]);

  return (
    <div className="mt-4 mb-2">
      <div className="mb-2">
        <h3 className="text-base font-semibold">{t('accepted_invitations')}</h3>
      </div>
      
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {invitations.map((invitation, index) => (
          <div 
            key={index}
            className="flex items-center justify-between px-4 py-2 bg-white rounded-full border"
          >
            <span className="text-sm">{invitation.email}</span>
            <span className="text-xs text-gray-500">{invitation.acceptedAt ? publishFormatDate(new Date(invitation.acceptedAt)) : ''}</span>
          </div>
        ))}
        
        {invitations.length === 0 && (

          <div className="text-center py-2 text-gray-500 text-sm">
            {t('no_accepted_invitations')}
          </div>
        )}
      </div>
    </div>
  );
};

export default AcceptedInvitationsList;

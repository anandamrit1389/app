import { useTranslation } from 'react-i18next';
import { PaginatedListSection } from '@/components/Lists/PaginatedListSection';
import AdminCompanyService from '@/api/adminCompany.service';
import MemberPendingItem from '@/components/MembersItems/MemberPendingItem';
import { CompanyInvitedMember } from '@/interfaces/companies';

export const PendingMembersSection = ({
  companyId,
  refreshTick,
}: {
  companyId: string;
  refreshTick: string;
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'adminPanel' });

  return (
    <PaginatedListSection<CompanyInvitedMember>
      t={t}
      isHeader={false}
      keyPrefix={'membersModal'}
      titleKey={'pending'}
      fetchPage={(params) => AdminCompanyService.getPendings(companyId, params)}
      keyExtractor={(i) => i.id}
      renderItem={(i) => <MemberPendingItem member={i} isMobile={false} />}
      pageSize={10}
      deps={[companyId, refreshTick]}
      empty={<></>}
    />
  );
};

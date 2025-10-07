import { useTranslation } from 'react-i18next';
import { PaginatedListSection } from '@/components/Lists/PaginatedListSection';
import AdminCompanyService from '@/api/adminCompany.service';
import { CompanyMember, CompanyMemberRole } from '@/interfaces/companies';
import MemberItem from '@/components/MembersItems/MemberItem';

export const MembersSection = ({
  companyId,
  refreshTick,
}: {
  companyId: string;
  refreshTick: string;
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'adminPanel' });

  return (
    <PaginatedListSection<CompanyMember>
      t={t}
      keyPrefix={'membersModal'}
      titleKey={'userInfo'}
      fetchPage={(params) => AdminCompanyService.getMembers(companyId, params)}
      keyExtractor={(i) => i.id}
      renderItem={(i) => (
        <MemberItem
          key={i.id}
          member={i}
          actions={[]}
          isDisabled={i.role === CompanyMemberRole.ADMIN}
        />
      )}
      pageSize={10}
      deps={[companyId, refreshTick]}
      empty={<></>}
    />
  );
};

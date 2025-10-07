import { CommonContext, PersonalContext, TeamContext } from '@/contexts/Dashboard.context';
import { useDashboard } from '@/hooks/useDashboard';
import { getTemplatesPreview } from '@/helpers/constants/presentation-templates.const';
import { useContext, useMemo } from 'react';
import { AuthContext } from './auth.provider';

export const DashboardProviders = ({ children }: { children: React.ReactNode }) => {
  const { companyMembershipInfo } = useContext(AuthContext);

  const personal = useDashboard('personal');
  const team = useDashboard('team', { enabled: !!companyMembershipInfo });
  const templates = useMemo(() => getTemplatesPreview(), []);

  const personalVal = useMemo(() => personal, [personal]);
  const teamVal = useMemo(() => team, [team]);
  const commonVal = useMemo(() => ({ templates }), [templates]);

  return (
    <CommonContext.Provider value={commonVal}>
      <PersonalContext.Provider value={personalVal}>
        <TeamContext.Provider value={teamVal}>{children}</TeamContext.Provider>
      </PersonalContext.Provider>
    </CommonContext.Provider>
  );
};

import { useLocation } from 'react-router-dom';
import DashboardNavItems from './Nav/DashboardNavItems';
import DashboardRoutes from './routes/dashboard-routes';
import { useDashboard } from '@/hooks/useDashboard';
import DashboardHeader from './DashboardHeader/DashboardHeader';
import {
  getAccessTokenFromStorage,
  getPresentationIdForCopyToStorage,
  removePresentationIdForCopyToStorage,
} from '@/helpers/utils/storage';
import useMobile from '@/hooks/useMobile';
import { useContext, useEffect, useState } from 'react';
import ProUpgrade from '@/components/ProUpgrade/ProUpgrade';
import MobileMenu from './Menu/MobileMenu/MobileMenu';
import LocaleNavigate from '@/components/Locales/LocaleNavigate/LocaleNavigate';
import InviteModal from '@/components/Modals/InviteModal/InviteModal';
import userService from '@/api/userService';
import { AuthContext } from '@/providers/auth.provider';
import InviteManyModal from '@/components/Modals/InviteManyModal/InviteManyModal';
import PresentationService from '@/api/presentationService';
import useLocaleNavigate from '@/hooks/useLocaleNavigate';
import { useSubscriptionModal } from '@/hooks/useSubscriptionModal';
import EnhancementFinalization from '@/components/Enhancement/EnhancementFinalization/EnhancementFinalization';
import LanguageSelect from '@/components/Selects/LanguageSelect/LanguageSelect';
import WorldDarkIcon from '@/assets/worldDark.svg?react';
import { DashboardProviders } from '@/providers/dashboard.provider';

const Dashboard = () => {
  const location = useLocation();
  const dashboardContext = useDashboard('personal');
  const isMobile = useMobile();
  const { hasActiveSubscription, userMission, handleRefreshProfile, user } =
    useContext(AuthContext);
  const navigate = useLocaleNavigate();
  const { open, onOpenChange } = useSubscriptionModal();

  const [inviteOpen, setInviteOpen] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const presentationToCopy = getPresentationIdForCopyToStorage();
    if (presentationToCopy) {
      dashboardContext.handleCopyPresentation(
        presentationToCopy.presentationId,
        presentationToCopy.lang,
      );
      removePresentationIdForCopyToStorage();
    }
  }, []);

  useEffect(() => {
    const demoData = sessionStorage.getItem('demo');
    if (user && demoData) {
      if (open) {
        onOpenChange();
      }
      const parsedDemoInput = JSON.parse(demoData);
      const generatePresentation = async () => {
        try {
          const { prompt, language, textAmount } = parsedDemoInput;
          const { result, description } = await PresentationService.generatePresentationOutline(
            prompt,
            language,
            textAmount,
          );
          const presentation = await PresentationService.generatePresentationFromOutline(
            result,
            'personal',
            description,
            language,
            textAmount,
            'light',
            'light',
            'inter',
            '',
            user.name ?? '',
            false,
            true,
            false,
            'web_stock_photos_only',
          );

          sessionStorage.removeItem('demo');
          navigate(`/presentation/${presentation.alias}`);
        } catch (error) {
          console.error(error);
        }
      };

      generatePresentation();
    }
  }, []);

  if (!getAccessTokenFromStorage()) {
    return <LocaleNavigate to="/" />;
  }

  const handleInviteFriends = async (emails: string[], lang: string) => {
    await userService.inviteManyUsers(emails, lang);
    handleRefreshProfile();
  };

  if (isMobile) {
    return (
      <div className="h-dvh w-screen">
        <DashboardHeader
          onOpenMenu={() => {
            setMenuOpen(!menuOpen);
          }}
        />
        <MobileMenu
          menuOpen={menuOpen}
          onOpenChange={() => setMenuOpen(!menuOpen)}
          onOpenInvite={() => setInviteOpen(!inviteOpen)}
        />
        <div className="flex h-dvh">
          <div className="size-full overflow-hidden">
            <DashboardProviders>
              <DashboardRoutes />
            </DashboardProviders>{' '}
          </div>
        </div>
        {userMission ? (
          <InviteManyModal
            open={inviteOpen}
            userMission={userMission}
            onOpenChange={() => setInviteOpen(!inviteOpen)}
            onInviteAction={handleInviteFriends}
          />
        ) : (
          <InviteModal
            open={inviteOpen}
            onOpenChange={() => setInviteOpen(!inviteOpen)}
            onInviteAction={handleInviteFriends}
          />
        )}
      </div>
    );
  }

  return (
    <div className="size-screen">
      <DashboardHeader />
      <div className="flex h-svh w-full pt-[64px]">
        <div className="flex min-w-[240px] max-w-[240px] flex-col justify-between bg-white p-6 pt-10">
          <DashboardNavItems
            activePath={location?.pathname}
            onOpenInvite={() => setInviteOpen((o) => !o)}
          />
          <div className="flex flex-col gap-5">
            {!hasActiveSubscription && <ProUpgrade />}
            <LanguageSelect
              icon={<WorldDarkIcon />}
              triggerClassName="hover:bg-[#F6F7F8] active:bg-lightGreyHover [&>svg:last-of-type]:hidden border-none bg-transparent"
              contentClassName="bottom-7 -right-6"
            />
          </div>
        </div>
        <div className="w-full overflow-hidden [&>div]:h-full">
          <DashboardProviders>
            <DashboardRoutes />
          </DashboardProviders>
        </div>
      </div>
      {userMission ? (
        <InviteManyModal
          open={inviteOpen}
          userMission={userMission}
          onOpenChange={() => setInviteOpen(!inviteOpen)}
          onInviteAction={handleInviteFriends}
        />
      ) : (
        <InviteModal
          open={inviteOpen}
          onOpenChange={() => setInviteOpen(!inviteOpen)}
          onInviteAction={handleInviteFriends}
        />
      )}
      <EnhancementFinalization />
    </div>
  );
};

export default Dashboard;

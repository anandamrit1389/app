import { AuthContext } from '@/providers/auth.provider';
import { RefObject, useContext, useRef, useEffect } from 'react';
import DashboardHeader from '../Dashboard/DashboardHeader/DashboardHeader';
import useDeviceDetect from '@/hooks/useDeviceDetect';
import { IProfileMenuItem } from '@/interfaces/IProfileSettings';
import ProfiledHeader from './ProfileHeader';
import ProfileSidebar from './ProfileSidebar';
import DeleteAccountSection from './DeleteAccountSection';
import NotificationsSection from './NotificationsSection';
import BasicInformationSection from './BasicInformationSection';
import SubscriptionSection from './SubscriptionSection';
import CreditsSection from './CreditsSection';
import ThemeUserSection from './ThemeUserSection';
import UserMissionsSection from './UserMissionsSection';
import { FeatureKey, UserRole } from '@/interfaces/IUser';
import { cn } from '@/lib/utils';
import LanguageSection from './LanguageSection';
import ManagementConsoleSection from './ManagementConsoleSection';
import RedeemCodeSection from './RedeemCodeSection';
import { useLocation } from 'react-router-dom';

const AccountSettings = () => {
  const { user, featuresAccess, userMission, hasActiveSubscription } = useContext(AuthContext);
  const location = useLocation();

  const basicInfoRef = useRef<HTMLDivElement>(null);
  const themeUserRef = useRef<HTMLDivElement>(null);
  const subscriptionRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const deleteAccRef = useRef<HTMLDivElement>(null);
  const creditsAccRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const managementConsoleRef = useRef<HTMLDivElement>(null);
  const redeemCodeRef = useRef<HTMLDivElement>(null);

  const accountSettingsMenu: IProfileMenuItem[] = [
    { id: 0, titleKey: 'managementConsole', ref: managementConsoleRef },
    { id: 1, titleKey: 'basicInfo', ref: basicInfoRef },
    { id: 2, titleKey: 'themeUserSection', ref: themeUserRef },
    { id: 3, titleKey: 'ownSubscriptionTitle', ref: subscriptionRef },
    { id: 4, titleKey: 'creditsAndUsageHistory', ref: creditsAccRef },
    { id: 5, titleKey: 'langTitle', ref: langRef },
    { id: 6, titleKey: 'notifications', ref: notificationsRef },
    { id: 7, titleKey: 'redeemCode', ref: redeemCodeRef },
    { id: 8, titleKey: 'deleteAcc', ref: deleteAccRef },
  ];

  const scrollToSection = (ref: RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  const { isMobile } = useDeviceDetect();

  const hasSubscriptionAccess = !!user?.subscription?.ownedSubscription || !hasActiveSubscription;

  const filteredMenu = accountSettingsMenu.filter((option) => {
    if (['ownSubscriptionTitle'].includes(option.titleKey) && !hasSubscriptionAccess) return false;
    if (['redeemCode'].includes(option.titleKey) && hasActiveSubscription) return false;
    if (
      option.titleKey === 'managementConsole' &&
      ![UserRole.Support, UserRole.Admin].includes(user?.role as UserRole)
    )
      return false;
    return true;
  });

  useEffect(() => {
    const section = new URLSearchParams(location.search).get('section');
    if (section === 'redeemCode' && !hasActiveSubscription) {
      setTimeout(() => redeemCodeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
    }
  }, [location.search, hasActiveSubscription]);

  if (!user) return null;

  return (
    <div className="bg-lightGrey">
      {!isMobile && <DashboardHeader />}
      <div
        className={cn('mx-auto max-w-[1150px] px-4 md:py-32 min-h-dvh', {
          'px-0': isMobile,
        })}
      >
        <ProfiledHeader />

        <div className="flex">
          {!isMobile && <ProfileSidebar items={filteredMenu} onSelect={scrollToSection} />}
          <div className="md:basis-8/12">
            <div
              className={cn('overflow-y-auto flex flex-col gap-6', {
                'gap-4': isMobile,
              })}
            >
              {[UserRole.Support, UserRole.Admin].includes(user?.role as UserRole) && (
                <ManagementConsoleSection user={user} sectionRef={managementConsoleRef} />
              )}
              <BasicInformationSection user={user} sectionRef={basicInfoRef} />
              {featuresAccess[FeatureKey.CUSTOM_COLORS].hasAccess ? (
                <ThemeUserSection user={user} sectionRef={themeUserRef} />
              ) : (
                userMission && (
                  <UserMissionsSection mission={userMission} sectionRef={themeUserRef} />
                )
              )}
              {hasSubscriptionAccess && (
                <SubscriptionSection user={user} sectionRef={subscriptionRef} />
              )}
              <CreditsSection
                credits={user.credits}
                sectionRef={creditsAccRef}
                isMobile={isMobile}
              />
              <LanguageSection sectionRef={langRef} isMobile={isMobile} />
              <NotificationsSection sectionRef={notificationsRef} user={user} isMobile={isMobile} />
              {!hasActiveSubscription && (
                <RedeemCodeSection user={user} sectionRef={redeemCodeRef} />
              )}
              <DeleteAccountSection sectionRef={deleteAccRef} user={user} isMobile={isMobile} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AccountSettings;

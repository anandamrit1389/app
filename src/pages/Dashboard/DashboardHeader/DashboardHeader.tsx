import InabitLogoColor from '@/assets/logo-inabit-color.svg?react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { AuthContext } from '@/providers/auth.provider';
import { useContext } from 'react';
import { ChevronDown, UserSearch } from 'lucide-react';
import AccountIcon from '@/assets/account.svg?react';
import SupportIcon from '@/assets/support.svg?react';
import NotificationsIcon from '@/assets/notifications.svg?react';
import LogoutIcon from '@/assets/logout.svg?react';
import MobileMenu from '@/assets/mobile-menu.svg?react';
import { NotificationsContext } from '@/providers/notifications.provider';
import useMobile from '@/hooks/useMobile';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import useLocaleNavigate from '@/hooks/useLocaleNavigate';
import { useSubscriptionModal } from '@/hooks/useSubscriptionModal';
import { getInitials } from '@/helpers/utils/user';
import Badge from '@/components/CustomUI/Badge/Badge';
import CoinFilled from '@/assets/coin-filled.svg?react';
import { PresentationLimitCounter } from '@/pages/Dashboard/components/presentations';
import { FeatureKey, UserRole } from '@/interfaces/IUser';
import Tag from '@/components/CustomUI/Tag/Tag';
import CompanyIcon from '@/assets/plans/enterprice-icon.svg?react';
import { useCredits } from '@/hooks/useCredits';

const DashboardHeader = ({ onOpenMenu }: { onOpenMenu?: () => void }) => {
  const { user, handleLogout, featuresAccess } = useContext(AuthContext);
  const { newNotificationsCount } = useContext(NotificationsContext);

  const { onOpenCreditPacksChange, handleChangeFilter, onOpenChange } = useSubscriptionModal();

  const navigate = useLocaleNavigate();
  const isMobile = useMobile();
  const credits = useCredits();

  const { t } = useTranslation('translation', { keyPrefix: 'dashboard' });


  const handleRedirect = (route: string) => {
    navigate(route);
  };

  const handleCompanyClick = () => {
    if (featuresAccess[FeatureKey.COMPANY_CONFIGURATION].hasAccess) {
      return handleRedirect('/company');
    }

    handleChangeFilter(['business']);
    return onOpenChange();
  };

  if (isMobile) {
    return (
      <div className="flex items-center justify-between p-3 ps-0">
        <Button variant={'ghost'} onClick={() => onOpenMenu?.()}>
          <MobileMenu />
        </Button>
        <InabitLogoColor onClick={() => handleRedirect('/dashboard')} />
      </div>
    );
  }

  return (
    <div className="fixed z-30 flex h-16 w-full items-center justify-between bg-white p-3 px-5 shadow-header">
      <InabitLogoColor onClick={() => handleRedirect('/dashboard')} className="cursor-pointer" />
      <div className="flex cursor-pointer items-center gap-4 text-[16px] text-black">
        <PresentationLimitCounter />
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-black"
          onClick={() => onOpenCreditPacksChange()}
        >
          <CoinFilled className="size-5" />
          <span className="text-sm font-medium text-darkText">
            {credits} {t('aicredits')}
          </span>
        </div>

        {user && (
          <>
            <Menubar className="relative h-12 rounded-full border-lightGreyPress p-0 transition-all hover:border-[#D1D5DB] focus:border-disabled active:border-disabled [&>button]:px-[9px] [&>button]:py-2">
              <MenubarMenu>
                <MenubarTrigger className="cursor-pointer" asChild>
                  <div className="flex items-center gap-[15px]">
                    <div className="relative">
                      <Avatar className="relative size-8">
                        <AvatarImage
                          className="object-cover"
                          src={user.profileImg ?? undefined}
                          alt="@shadcn"
                        />
                        <AvatarFallback>{getInitials(user)}</AvatarFallback>
                      </Avatar>
                      {!!newNotificationsCount && <Badge>{newNotificationsCount}</Badge>}
                    </div>
                    <ChevronDown size="20" color="#374151" />
                  </div>
                </MenubarTrigger>
                <MenubarContent className="flex flex-col gap-2 p-2" align="end">
                  <MenubarItem
                    className="relative flex cursor-pointer items-center gap-1 text-sm text-darkText hover:bg-lightGrey"
                    onClick={() => handleRedirect('/profile')}
                  >
                    <AccountIcon />
                    {t('account')}
                  </MenubarItem>
                  <MenubarItem
                    className="relative flex cursor-pointer items-center gap-1 text-sm text-darkText hover:bg-lightGrey"
                    onClick={handleCompanyClick}
                  >
                    <CompanyIcon className="w-6" />
                    {t('company')}
                    {!featuresAccess[FeatureKey.COMPANY_CONFIGURATION].hasAccess && (
                      <Tag
                        classNames={
                          'py-[6px] px-2 text-[12px] leading-[12px] bg-[#BD9E60] rounded cursor-pointer'
                        }
                      >
                        {t('bussines')}
                      </Tag>
                    )}
                  </MenubarItem>

                  <MenubarItem
                    className="relative flex cursor-pointer items-center gap-1 text-sm text-darkText hover:bg-lightGrey"
                    onClick={() => handleRedirect('/support')}
                  >
                    <SupportIcon />
                    {t('support')}
                  </MenubarItem>
                  <MenubarItem
                    className="relative flex cursor-pointer items-center gap-1 text-sm text-darkText hover:bg-lightGrey"
                    onClick={() => handleRedirect('/notifications')}
                  >
                    <NotificationsIcon />
                    {t('notifications')}
                    {!!newNotificationsCount && (
                      <Badge classNames="top-1/2 right-3 -translate-y-1/2 w-2 h-2" />
                    )}
                  </MenubarItem>
                  {(user?.role === UserRole.Admin || user?.role === UserRole.Support) && (
                    <MenubarItem
                      className="relative flex cursor-pointer items-center gap-1 text-sm text-darkText hover:bg-lightGrey"
                      onClick={() => handleRedirect('/config')}
                    >
                      <UserSearch />
                      {t('config')}
                    </MenubarItem>
                  )}
                  <MenubarItem
                    className="relative flex cursor-pointer items-center gap-1 text-sm text-darkText hover:bg-lightGrey"
                    onClick={handleLogout}
                  >
                    <LogoutIcon /> {t('signOut')}
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;

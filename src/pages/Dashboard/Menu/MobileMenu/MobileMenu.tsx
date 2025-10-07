import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { X, UserSearch } from 'lucide-react';
import DashboardNavItems from '../../Nav/DashboardNavItems';
import ProUpgrade from '@/components/ProUpgrade/ProUpgrade';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/providers/auth.provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FeatureKey, User, UserRole } from '@/interfaces/IUser';
import AccountIcon from '@/assets/account.svg?react';
import SupportIcon from '@/assets/support.svg?react';
import NotificationsIcon from '@/assets/notifications.svg?react';
import LogoutIcon from '@/assets/logout.svg?react';
import ArrowBack from '@/assets/arrow-back.svg?react';
import { useTranslation } from 'react-i18next';
import useLocaleNavigate from '@/hooks/useLocaleNavigate';
import { useSubscriptionModal } from '@/hooks/useSubscriptionModal';
import CoinFilled from '@/assets/coin-filled.svg?react';
import { PresentationLimitCounter } from '@/pages/Dashboard/components/presentations';
import Tag from '@/components/CustomUI/Tag/Tag';
import CompanyIcon from '@/assets/plans/enterprice-icon.svg?react';
import LanguageSelect from '@/components/Selects/LanguageSelect/LanguageSelect';
import WorldDarkIcon from '@/assets/worldDark.svg?react';

interface IProps {
  menuOpen: boolean;
  onOpenChange: () => void;
  onOpenInvite?: () => void;
  user?: User | null;
  onLogout?: () => void;
}

const MobileMenu = ({ menuOpen, onOpenChange, onOpenInvite }: IProps) => {
  const { onOpenCreditPacksChange } = useSubscriptionModal();
  const { user, handleLogout, hasActiveSubscription } = useContext(AuthContext);
  const { t } = useTranslation('translation', { keyPrefix: 'dashboard' });

  const [showSettings, setShowSettings] = useState<boolean>(false);

  useEffect(() => {
    if (menuOpen) {
      onOpenChange();
    }
  }, [location?.pathname]);

  return (
    <>
      <Sheet open={menuOpen} onOpenChange={onOpenChange}>
        <SheetContent
          outsideclose="true"
          side="left"
          className="flex w-full justify-start p-4 pt-2"
        >
          <div className="flex w-full flex-col justify-between gap-2 bg-white">
            <div>
              <div className="mb-6 flex items-center justify-between">
                {user && (
                  <Avatar
                    className="relative size-8"
                    onClick={() => setShowSettings(!showSettings)}
                  >
                    <AvatarImage src={user.profileImg ?? undefined} alt="@shadcn" />
                    <AvatarFallback className="bg-default-gradient font-semibold text-white">
                      {user.email?.[0]?.toUpperCase() ?? '?'}
                    </AvatarFallback>
                  </Avatar>
                )}
                <SheetTitle className="text-[16px] font-bold">{t('menu')}</SheetTitle>
                <Button
                  onClick={onOpenChange}
                  variant={'secondary'}
                  className="size-8 rounded-full p-1"
                >
                  <X className="size-4 p-0" />
                </Button>
              </div>
              <div className="mb-4 flex items-center gap-4">
                <div
                  className="flex flex-1 items-center rounded-lg bg-gray-50 px-3 py-2.5 min-w-0"
                  onClick={() => onOpenCreditPacksChange()}
                >
                  <CoinFilled className="mr-2 size-5 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {user?.credits} {t('aicredits')}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                  <PresentationLimitCounter />
                </div>
              </div>
              <DashboardNavItems
                activePath={location?.pathname}
                onOpenInvite={onOpenInvite ?? (() => {})}
              />
            </div>
            <div className="flex flex-col gap-5">
              <LanguageSelect
                icon={<WorldDarkIcon />}
                triggerClassName="hover:bg-[#F6F7F8] active:bg-lightGreyHover [&>svg:last-of-type]:hidden border-none bg-transparent"
                contentClassName="bottom-7 -right-6"
                isMobile={true}
              />
              {!hasActiveSubscription && <ProUpgrade />}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Settings
        menuOpen={showSettings}
        onOpenChange={() => {
          setShowSettings(!showSettings);
        }}
        onLogout={handleLogout}
        user={user}
      />
    </>
  );
};

export default MobileMenu;

const Settings = ({ menuOpen, onOpenChange, user, onLogout }: IProps) => {
  const { featuresAccess } = useContext(AuthContext);
  const { onOpenChange: onSubscriptionOpen, handleChangeFilter } = useSubscriptionModal();

  const navigate = useLocaleNavigate();
  const { t } = useTranslation('translation', { keyPrefix: 'dashboard' });

  const handleRedirect = (route: string) => {
    navigate(route);
  };

  const handleCompanyClick = () => {
    if (featuresAccess[FeatureKey.COMPANY_CONFIGURATION].hasAccess) {
      return handleRedirect('/company');
    }
    handleChangeFilter(['business']);
    return onSubscriptionOpen();
  };

  return (
    <Sheet open={menuOpen} onOpenChange={onOpenChange}>
      <SheetContent
        outsideclose="true"
        side="right"
        className="flex w-full flex-col justify-start p-4 pt-2"
      >
        <div className="flex items-center justify-between">
          <BaseButton variant="ghost" onClick={onOpenChange} classNames="p-0">
            <ArrowBack />
          </BaseButton>
          <SheetTitle>{t('settings')}</SheetTitle>
          <BaseButton classNames="opacity-0 p-0" variant="ghost" onClick={onOpenChange}>
            <ArrowBack />
          </BaseButton>
        </div>
        <div className="flex w-full justify-center">
          {user && (
            <Avatar className="relative size-20">
              <AvatarImage src={user.profileImg ?? undefined} alt="@shadcn" />
              <AvatarFallback className="bg-default-gradient font-semibold text-white">
                {user.email?.[0]?.toUpperCase() ?? '?'}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
        <div>
          <BaseButton
            variant="ghost"
            classNames="h-10 mb-2 py-1 px-2 w-full justify-start relative flex items-center gap-2 cursor-pointer hover:bg-lightGrey text-sm text-darkText"
            onClick={() => handleRedirect('/profile')}
          >
            <AccountIcon />
            {t('account')}
          </BaseButton>
          <BaseButton
            variant="ghost"
            classNames="h-10 mb-2 py-1 px-2 w-full justify-start relative flex items-center gap-2 cursor-pointer hover:bg-lightGrey text-sm text-darkText"
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
          </BaseButton>
          <BaseButton
            variant="ghost"
            classNames="h-10 mb-2 py-1 px-2 w-full justify-start relative flex items-center gap-2 cursor-pointer hover:bg-lightGrey text-sm text-darkText"
            onClick={() => handleRedirect('/support')}
          >
            <SupportIcon />
            {t('support')}
          </BaseButton>
          <BaseButton
            variant="ghost"
            classNames="h-10 mb-2 py-1 px-2 w-full justify-start relative flex items-center gap-2 cursor-pointer hover:bg-lightGrey text-sm text-darkText"
            onClick={() => handleRedirect('/notifications')}
          >
            <NotificationsIcon />
            {t('notifications')}
          </BaseButton>
          {(user?.role === UserRole.Admin || user?.role === UserRole.Support) && (
            <BaseButton
              variant="ghost"
              classNames="h-10 mb-2 py-1 px-2 w-full justify-start relative flex items-center gap-2 cursor-pointer hover:bg-lightGrey text-sm text-darkText"
              onClick={() => handleRedirect('/config')}
            >
              <UserSearch />
              {t('config')}
            </BaseButton>
          )}
          <BaseButton
            variant="ghost"
            classNames="h-10 py-1 px-2 w-full justify-start relative flex items-center gap-2 cursor-pointer hover:bg-lightGrey text-sm text-darkText"
            onClick={() => onLogout?.()}
          >
            <LogoutIcon /> {t('signOut')}
          </BaseButton>
        </div>
      </SheetContent>
    </Sheet>
  );
};

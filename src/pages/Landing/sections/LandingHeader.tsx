import InabitLogoColor from '@/assets/landing/inabit-logo-color-48.svg';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import useLocaleNavigate from '@/hooks/useLocaleNavigate';
import { MenuIcon, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { analyticsService } from '@/helpers/services/AnalyticsService';

const navMenu = [
  {
    titleKey: 'pricing',
    link: '/pricing',
  },
];

const LandingHeader = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'landing' });
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useLocaleNavigate();

  const handleRedirect = () => {
    analyticsService.landingPageGetStarted();
    navigate('/login');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <header
      className={cn('h-[64px] w-full shadow-header md:h-20 border-b', {
        'border-neutral-300': isOpen,
        'border-transparent': !isOpen,
      })}
    >
      <div className="m-auto max-w-screen-big-desktop">
        <div className="z-30 flex size-full items-center justify-between bg-white px-4 py-3 tablet:px-6 tablet:py-4 small-desktop:px-6 small-desktop:py-4 desktop:px-6 desktop:py-4">
          <div onClick={handleLogoClick} className="h-[40px] cursor-pointer tablet:h-[48px]">
            <img src={InabitLogoColor} alt="Inabit Logo" />
          </div>

          <div className="flex items-center gap-6">
            <ul className="hidden md:flex">
              {navMenu.map(({ titleKey, link }) => (
                <Link
                  to={link}
                  key={titleKey}
                  className="p-3 font-medium text-neutral-900 hover:text-neutral-950"
                >
                  {t(titleKey)}
                </Link>
              ))}
            </ul>
            <BaseButton onClick={handleRedirect} classNames="uppercase h-[40px] tablet:h-[48px]">
              {t('headerCTA')}
            </BaseButton>

            {isOpen ? (
              <BaseButton
                classNames="md:hidden"
                icon={<X />}
                size="icon"
                variant="ghost"
                onClick={toggleMenu}
              ></BaseButton>
            ) : (
              <BaseButton
                classNames="md:hidden"
                icon={<MenuIcon />}
                size="icon"
                variant="ghost"
                onClick={toggleMenu}
              ></BaseButton>
            )}
          </div>
        </div>
      </div>

      {
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent
            className="top-[64px] h-max w-full rounded-b-3xl transition-none data-[state=closed]:duration-0 data-[state=open]:duration-0 sm:max-w-full md:hidden [&_button:has(svg)]:hidden"
            overlayClassName="top-[64px]"
            side="top"
          >
            <ul className="flex flex-col items-center justify-center">
              {navMenu.map(({ titleKey, link }) => (
                <Link
                  to={link}
                  key={titleKey}
                  className="p-3 text-lg font-medium text-neutral-900 hover:text-neutral-950"
                >
                  {t(titleKey)}
                </Link>
              ))}
            </ul>
          </SheetContent>
        </Sheet>
      }
    </header>
  );
};

export default LandingHeader;

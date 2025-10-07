import InabitLogoColor from '@/assets/logo-inabit-color.svg?react';
import { useTranslation } from 'react-i18next';
import WorldIcon from '@/assets/world.svg?react';
import LanguageSelect from '@/components/Selects/LanguageSelect/LanguageSelect';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import React from 'react';
import SocialMedia from '@/components/SocialMedia/socialMedia';
import useMobile from '@/hooks/useMobile';
import { cn } from '@/lib/utils';
import LocaleLink from '@/components/Locales/LocaleLink/LocaleLink';
import { useCookieConsent } from '@/features/cookie-consent';

interface IFooterSection {
  logo: React.ReactNode;
  name: string;
  description: string;
  copyright: string;
}

interface FooterMenu {
  path: string;
  label: string;
}

const section: IFooterSection = {
  logo: <InabitLogoColor />,
  name: 'footerName',
  description: 'footerDescription',
  copyright: 'footerCopyright',
};

const footerMenu: FooterMenu[] = [
  {
    path: '/terms-of-use',
    label: 'Terms of Use',
  },
  {
    path: '/privacy-policy',
    label: 'Privacy Policy',
  },
  {
    path: '/cookie-policy',
    label: 'Cookie Policy',
  },
  {
    path: '/license-agreement',
    label: 'License Agreement',
  },
];

const FooterSection = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'landing' });

  const isMobile = useMobile();
  const { onShowSettings } = useCookieConsent();

  const handleToggleSettings = () => {
    onShowSettings();
  };

  return (
    <footer className="z-50 w-full bg-black">
      <div className="m-auto max-w-screen-big-desktop">
        <div className="flex flex-col px-8 py-14 tablet:px-8 tablet:py-20 small-desktop:px-40 small-desktop:py-20 desktop:px-[152px] desktop:py-20">
          <div className="mb-10 flex flex-col items-start justify-between gap-4 tablet:flex-row tablet:items-center">
            <div className="flex flex-row items-center gap-2">
              {React.cloneElement(section.logo as React.ReactElement, {
                width: 56,
                height: 48,
              })}
              <h1 className="text-center text-white text-secondaryTitle">{t(section.name)}</h1>
            </div>
            <div
              className={cn('flex flex-row items-center', {
                'w-full': isMobile,
              })}
            >
              <SocialMedia />
            </div>
          </div>

          <div
            className={cn(
              'flex flex-row items-center justify-between border-t border-[#ffffff20] py-[18px] pb-[10px] text-bodySmall text-[#D1D5DB]',
              {
                'flex-col-reverse items-start gap-5': isMobile,
              },
            )}
          >
            <p>{t(section.copyright, { date: new Date().getFullYear() })}</p>
            <nav>
              <ul
                className={cn('flex w-full items-center flex-row justify-between', {
                  'justify-start flex-col items-start gap-2 py-2': isMobile,
                })}
              >
                {footerMenu.map((menuItem) => (
                  <React.Fragment key={menuItem.path}>
                    <li>
                      <LocaleLink
                        className="text-sm text-lightGreyPress hover:text-white"
                        to={menuItem.path}
                      >
                        {menuItem.label}
                      </LocaleLink>
                    </li>
                    <li
                      className={cn('mx-2.5 size-1 rounded-full bg-darkText', {
                        hidden: isMobile,
                      })}
                    />
                  </React.Fragment>
                ))}
                <li>
                  <BaseButton
                    classNames="p-0 max-md:pt-2"
                    variant="link"
                    onClick={handleToggleSettings}
                  >
                    {t('cookieSettings')}
                  </BaseButton>
                </li>
                <li
                  className={cn('mx-2.5 size-1 rounded-full bg-darkText', {
                    hidden: isMobile,
                  })}
                />
                <li>
                  <LanguageSelect
                    triggerClassName="[&>svg:last-of-type]:hidden border-none bg-transparent max-md:px-0"
                    icon={<WorldIcon />}
                  />
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;

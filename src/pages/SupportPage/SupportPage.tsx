import { AuthContext } from '@/providers/auth.provider';
import { RefObject, useContext, useRef } from 'react';
import DashboardHeader from '../Dashboard/DashboardHeader/DashboardHeader';
import useDeviceDetect from '@/hooks/useDeviceDetect';
import ArrowLeftIcon from '@/assets/arrow-left.svg?react';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import CloseIcon from '@/assets/x.svg?react';
import { useTranslation } from 'react-i18next';
import useLocaleNavigate from '@/hooks/useLocaleNavigate';
import MainIcon from '@/assets/mail.svg?react';
//import DiscordLocoIcon from "@/assets/discord-logo-white.svg?react";
import SupportForm from '@/components/Forms/SupportForm/SupportForm';

const SupportPage = () => {
  const navigate = useLocaleNavigate();
  const { user } = useContext(AuthContext);
  const { t } = useTranslation('translation', { keyPrefix: 'support' });

  const supportEmail = useRef(null);
  const reportBug = useRef(null);
  //const community = useRef(null);

  const accountSettingsMenu = [
    { id: 1, titleKey: 'supportEmail', ref: supportEmail },
    { id: 2, titleKey: 'reportBug', ref: reportBug },
    // { id: 3, titleKey: "community", ref: community },
  ];

  const scrollToSection = (ref: RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const { isMobile } = useDeviceDetect();

  if (!user) return null;

  return (
    <div className="bg-lightGrey">
      {!isMobile && <DashboardHeader />}
      <div className="mx-auto min-h-dvh max-w-[1150px] px-4 pb-8 md:py-32">
        <div className="relative flex h-[64px] items-center justify-center py-[18px] md:flex-row-reverse md:justify-between">
          {isMobile ? (
            <BaseButton
              onClick={() => navigate(-1)}
              variant="ghost"
              size="sm"
              classNames="absolute top-1/2 left-0 -translate-y-1/2 p-0"
              icon={<ArrowLeftIcon />}
            />
          ) : (
            <BaseButton
              onClick={() => navigate('/dashboard')}
              isDark
              variant="secondary"
              size="sm"
              classNames="!hidden md:!flex uppercase py-1.5 px-3 flex gap-1 items-center font-semibold text-xs leading-3"
            >
              {t('backBtn')}
              <CloseIcon />
            </BaseButton>
          )}
          <h1 className="pl-4 text-base font-bold text-darkHeadline md:text-xl">
            {t('pageTitle')}
          </h1>
        </div>

        <div className="flex">
          {!isMobile && (
            <div className="mr-8 md:basis-4/12">
              <div className="sticky h-auto rounded bg-white p-4">
                <ul>
                  {accountSettingsMenu.map((item) => (
                    <li
                      key={item.id}
                      onClick={() => scrollToSection(item.ref)}
                      className="mb-[10px] cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-darkText last:mb-0 hover:bg-[#F6F7F8] active:bg-lightGreyHover"
                    >
                      {t(item.titleKey)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <div className="md:basis-8/12">
            <div className="flex flex-col gap-6 overflow-y-auto">
              <div
                id="support-email"
                ref={supportEmail}
                className="rounded-lg bg-white px-4 py-6 md:p-10"
              >
                <p className="mb-4 text-base font-semibold text-darkHeadline">
                  {t('supportEmail')}
                </p>
                <p className="mb-4 text-sm text-darkText">{t('supportEmailDescripton')}</p>
                <a href="mailto:info@inabit.ai" className="flex w-max">
                  <BaseButton
                    classNames="py-[9px] px-[11px] gap-1"
                    size="sm"
                    variant="outline"
                    icon={<MainIcon />}
                  >
                    {t('supportEmailButton')}
                  </BaseButton>
                </a>
              </div>
              {/* <div
                id="community"
                ref={community}
                className="rounded-lg bg-white px-4 py-6 md:p-10"
              >
                <p className="mb-4 text-base font-semibold text-darkHeadline">
                  {t("community")}
                </p>
                <p className="mb-4 text-sm text-darkText">
                  {t("supportEmailDescripton")}
                </p>
                <a href="#" className="flex w-max">
                  <BaseButton
                    classNames="bg-[#5865F2] py-3 px-4 rounded-full hover:bg-[#4B56CE] active:bg-[#4B56CE] focus:bg-[#5865F2]"
                    size="sm"
                    icon={<DiscordLocoIcon />}
                  />
                </a>
              </div> */}
              <div
                id="report-email"
                ref={reportBug}
                className="rounded-lg bg-white px-4 py-6 md:p-10"
              >
                <p className="mb-4 text-base font-semibold text-darkHeadline">{t('reportBug')}</p>
                <p className="text-sm text-darkText">{t('reportBugDescription1')}</p>
                <p className="text-sm font-bold text-darkText">{t('reportBugDescription2')}</p>
                <p className="mb-4 text-sm text-darkText">{t('reportBugDescription3')}</p>

                <SupportForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SupportPage;

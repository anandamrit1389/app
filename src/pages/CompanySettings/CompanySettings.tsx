import { AuthContext } from '@/providers/auth.provider';
import { RefObject, useContext, useRef } from 'react';
import DashboardHeader from '../Dashboard/DashboardHeader/DashboardHeader';
import useDeviceDetect from '@/hooks/useDeviceDetect';
import { IProfileMenuItem } from '@/interfaces/IProfileSettings';
import CompanyHeader from './CompanyHeader';
import CompanySidebar from './CompanySidebar';
import OrganisationDataSection from './OrganisationData';
import { useCompany } from '@/hooks/useCompany';
import { useNavigate } from 'react-router-dom';
import MembersSection from './MembersSection';
import ThemeSection from './ThemeSection';
import { FeatureKey } from '@/interfaces/IUser';

const CompanySettings = () => {
  const { featuresAccess } = useContext(AuthContext);
  const { companyInfo, companyDetails, loadCompanyDetails } = useCompany();
  const navigate = useNavigate();

  const organisationDataRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);
  const membersRef = useRef<HTMLDivElement>(null);

  const accountSettingsMenu: IProfileMenuItem[] = [
    { id: 1, titleKey: 'organisationDataSection', ref: organisationDataRef },
    { id: 2, titleKey: 'themeTitle', ref: themeRef },
    { id: 3, titleKey: 'membersTitle', ref: membersRef },
  ];

  const scrollToSection = (ref: RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const { isMobile } = useDeviceDetect();
  if (!featuresAccess[FeatureKey.COMPANY_CONFIGURATION].hasAccess) navigate('/dashboard');

  const handleRefreshCompanyDetails = async () => {
    await loadCompanyDetails();
  };

  return (
    <div className="bg-lightGrey">
      {!isMobile && <DashboardHeader />}
      <div className="mx-auto min-h-dvh max-w-[1150px] px-4 md:py-32">
        <CompanyHeader />

        <div className="flex">
          {!isMobile && <CompanySidebar items={accountSettingsMenu} onSelect={scrollToSection} />}
          <div className="md:basis-8/12">
            <div className="flex flex-col gap-6 overflow-y-auto">
              {companyInfo && (
                <OrganisationDataSection company={companyInfo} sectionRef={organisationDataRef} />
              )}
              {companyInfo && <ThemeSection company={companyInfo} sectionRef={themeRef} />}
              {companyDetails && (
                <MembersSection
                  sectionRef={membersRef}
                  companyDetails={companyDetails}
                  refresh={handleRefreshCompanyDetails}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CompanySettings;

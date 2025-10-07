import { useContext } from 'react';
import FAQSection from './sections/FaqSection';
import FooterSection from './sections/FooterSection';
import LandingHeader from './sections/LandingHeader';
import RoleBasedFeatures from './sections/RoleBasedFeatures';
import { AuthContext } from '@/providers/auth.provider';
import LocaleNavigate from '@/components/Locales/LocaleNavigate/LocaleNavigate';
import { getAccessTokenFromStorage } from '@/helpers/utils/storage';
import VideoSection from './sections/VideoSection';
import PrimarySectionV3 from './sections/PrimarySection';
import ValueProposition from './sections/ValueProposition';
import BenefitsOverview from './sections/BenefitsOverview';
import MediaContentShowcase from './sections/MediaContentShowcase';
import { PrettifyContext } from '@/contexts/Prettify.context';
import { usePrettifyPage } from '@/hooks/usePrettifyPage';

const Landing = () => {
  const { accessToken } = useContext(AuthContext);
  const isLoggedIn = accessToken || getAccessTokenFromStorage();
  const contextValue = usePrettifyPage();

  if (isLoggedIn) {
    return <LocaleNavigate to="/dashboard" />;
  }

  return (
    <PrettifyContext.Provider value={contextValue}>
      <div className="flex min-h-screen items-center justify-center bg-white ">
        <div className="w-full bg-white">
          <LandingHeader />
          <PrimarySectionV3 />
          <VideoSection />
          <RoleBasedFeatures />
          <BenefitsOverview />
          <ValueProposition />
          <MediaContentShowcase />
          <FAQSection />
          <FooterSection />
        </div>
      </div>
    </PrettifyContext.Provider>
  );
};

export default Landing;

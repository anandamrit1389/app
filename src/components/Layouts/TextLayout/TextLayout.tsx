import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import CloseIcon from '@/assets/x.svg?react';
import { useTranslation } from 'react-i18next';
import useLocaleNavigate from '@/hooks/useLocaleNavigate';
import { useContext, useEffect } from 'react';
import LandingHeader from '@/pages/Landing/sections/LandingHeader';
import { AuthContext } from '@/providers/auth.provider';
import { getAccessTokenFromStorage } from '@/helpers/utils/storage';
import DashboardHeader from '@/pages/Dashboard/DashboardHeader/DashboardHeader';

interface TextLayoutProps {
  children: React.ReactNode;
}

const TextLayout = ({ children }: TextLayoutProps) => {
  const navigate = useLocaleNavigate();
  const { t } = useTranslation('translation', { keyPrefix: 'common' });
  const { accessToken } = useContext(AuthContext);

  const renderHeader = () => {
    if (!accessToken && !getAccessTokenFromStorage()) {
      return <LandingHeader />;
    } else {
      return <DashboardHeader />;
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {renderHeader()}
      <div className="mx-auto w-[782px] max-w-full px-4 pb-80 pt-32">
        <div className="mb-6 flex justify-end">
          <BaseButton
            onClick={handleBack}
            isDark
            variant="secondary"
            size="sm"
            classNames="py-1.5 px-3 flex gap-1 items-center font-semibold text-xs leading-3 uppercase"
          >
            {t('back')}
            <CloseIcon />
          </BaseButton>
        </div>
        <section className="font-inter">{children}</section>
      </div>
    </>
  );
};

export default TextLayout;

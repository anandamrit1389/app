import useDeviceDetect from '@/hooks/useDeviceDetect';
import useLocaleNavigate from '@/hooks/useLocaleNavigate';
import ArrowLeftIcon from '@/assets/arrow-left.svg?react';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import CloseIcon from '@/assets/x.svg?react';
import { useTranslation } from 'react-i18next';

const CompanyHeader = () => {
  const navigate = useLocaleNavigate();
  const { isMobile } = useDeviceDetect();
  const { t } = useTranslation('translation', { keyPrefix: 'company' });

  return (
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
      <h1 className="pl-4 text-base font-bold text-darkHeadline md:text-xl">{t('pageTitle')}</h1>
    </div>
  );
};

export default CompanyHeader;

import useLocaleNavigate from '@/hooks/useLocaleNavigate';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import CloseIcon from '@/assets/x.svg?react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

const AdminPanelHeader = () => {
  const navigate = useLocaleNavigate();
  const { t } = useTranslation('translation', { keyPrefix: 'adminPanel' });

  return (
    <div
      className={cn(
        'relative flex items-center justify-center pb-6 md:flex-row-reverse md:justify-between',
      )}
    >
        <BaseButton
          onClick={() => navigate('/dashboard')}
          isDark
          variant="secondary"
          size="sm"
          classNames="!hidden md:!flex uppercase py-2 px-3 flex gap-1 items-center font-semibold leading-3"
        >
          {t('backBtn')}
          <CloseIcon />
        </BaseButton>

      <h1 className="pl-3 text-base font-bold text-darkHeadline md:text-xl">{t('pageTitle')}</h1>
    </div>
  );
};

export default AdminPanelHeader;

import { useTranslation } from 'react-i18next';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { useSubscriptionModal } from '@/hooks/useSubscriptionModal';
import useLocaleNavigate from '@/hooks/useLocaleNavigate';
import TemplateIcon from '@/assets/icon-placeholder.svg?react';
import ProCrown from '@/assets/pro-crown.svg?react';

export const UpgradeCard = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'dashboard' });
  const { onOpenChange } = useSubscriptionModal();
  const navigate = useLocaleNavigate();

  const handleTemplateClick = () => {
    navigate(`/dashboard/templates`);
  };

  return (
    <div
      className={`max-w-[376px] flex flex-col gap-2 px-4 py-3 rounded-lg bg-white shadow-md z-50`}
    >
      <div className="flex items-start gap-2">
        <TemplateIcon />
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-bold">{t('freePresentation')}</h3>

          <p className="text-sm text-darkHeadline">{t('upgradeForMore')}</p>
        </div>
      </div>
      <div className="flex gap-2 mt-2">
        <BaseButton onClick={handleTemplateClick} variant="outline" classNames="flex-1">
          {t('useTemplates')}
        </BaseButton>

        <BaseButton onClick={onOpenChange} classNames="flex-1 bg-[var(--pro-badge-bg)] text-white">
          <ProCrown className="size-5 mr-0.5" /> {t('upgradeToPro')}
        </BaseButton>
      </div>
    </div>
  );
};

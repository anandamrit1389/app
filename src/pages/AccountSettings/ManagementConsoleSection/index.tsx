import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { useTranslation } from 'react-i18next';

import { User } from '@/interfaces/IUser';
import { cn } from '@/lib/utils';
import useDeviceDetect from '@/hooks/useDeviceDetect';
import SettingsIcon from '@/assets/settings.svg?react';
import useLocaleNavigate from '@/hooks/useLocaleNavigate';

interface IProps {
  sectionRef: React.RefObject<HTMLDivElement>;
  user: User;
}

const ManagementConsoleSection = ({ sectionRef }: IProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'account' });
  const { isMobile } = useDeviceDetect();
  const navigate = useLocaleNavigate();

  return (
    <div
      id="subscription-account"
      ref={sectionRef}
      className={cn('p-10 bg-white', {
        'px-4 py-6': isMobile,
        'rounded-lg': !isMobile,
      })}
    >
      <div
        className={cn('w-11/12 flex flex-col gap-4', {
          'w-full': isMobile,
        })}
      >
        <div className="flex flex-row items-center justify-between">
          <p className="text-base font-semibold  text-darkHeadline">{t('managementConsole')}</p>

          <BaseButton
            onClick={() => navigate('/config/users')}
            classNames="px-3 py-2 text-sm"
            variant="outline"
            icon={<SettingsIcon />}
          >
            {t('openConsole')}
          </BaseButton>
        </div>
      </div>
    </div>
  );
};

export default ManagementConsoleSection;

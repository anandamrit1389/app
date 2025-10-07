import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { useTranslation } from 'react-i18next';
import AIStar from '@/assets/star-filled.svg?react';

interface HeaderProps {
  title: string;
  onGenerateNew: () => void;
}

const Header = ({ title, onGenerateNew }: HeaderProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'dashboard' });

  return (
    <div className="flex items-center justify-between py-2 sm:mb-8">
      <h1 className="text-xl font-bold text-text-primary md:text-2xl">{title}</h1>
      <BaseButton onClick={onGenerateNew} classNames="h-8 md:hidden" icon={<AIStar />}>
        {t('generateNewImage')}
      </BaseButton>
    </div>
  );
};

export default Header;

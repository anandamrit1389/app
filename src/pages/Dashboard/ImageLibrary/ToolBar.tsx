import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { IMAGE_LIBRARY_FILTERS } from '@/helpers/constants/image-library.const';
import { ImagesFilterValue } from '@/interfaces/images-gallery.interface';
import { useTranslation } from 'react-i18next';

interface ToolBarProps {
  activeFilter: ImagesFilterValue;
  onFilterClick: (value: ImagesFilterValue) => void;
  onGenerateNew: () => void;
}

const ToolBar = ({ activeFilter, onFilterClick, onGenerateNew }: ToolBarProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'dashboard' });

  return (
    <div className="mb-2 flex items-center justify-between py-2 sm:mb-6 sm:py-0">
      <div className="flex items-center gap-2 overflow-x-auto">
        {IMAGE_LIBRARY_FILTERS.map((filter) => (
          <BaseButton
            key={filter.id}
            onClick={() => onFilterClick(filter.value)}
            variant="outline"
            classNames={`${
              activeFilter === filter.value ? 'bg-cta-surface-lightFocus' : 'text-text-dark'
            } h-8 border-cta-surface-lightFocus`}
          >
            {t(filter.labelKey)}
          </BaseButton>
        ))}
      </div>
      <BaseButton onClick={onGenerateNew} classNames="hidden h-10 md:flex">
        {t('generateNewImage')}
      </BaseButton>
    </div>
  );
};

export default ToolBar;

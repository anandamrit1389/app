import { cn } from '@/lib/utils';
import AIStar from '@/assets/ai-star-black.svg?react';
import { ImageStyleCategory } from '@/interfaces/images-styles.interface';
import { useTranslation } from 'react-i18next';

interface ImageStyleCategoryItemProps {
  imageStyleCategory: ImageStyleCategory;
  isSelected: boolean;
  onCategoryChange: (category: ImageStyleCategory) => void;
}

const ImageStyleCategoryItem = ({
  imageStyleCategory,
  isSelected,
  onCategoryChange,
}: ImageStyleCategoryItemProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'prompt' });

  const handleCategoryChange = () => {
    onCategoryChange(imageStyleCategory);
  };
  return (
    <div
      onClick={handleCategoryChange}
      className={cn(
        'shrink-0 flex items-center ring-[1.5px] ring-lightGreyPress hover:ring-[#d1d5db] cursor-pointer pl-1 pr-4 py-0.5 rounded-full gap-1 transition-shadow',
        {
          'ring-[#374151] hover:ring-[#374151]': isSelected,
        },
      )}
    >
      <img
        src={imageStyleCategory.thumbSrc}
        alt={t(imageStyleCategory.title)}
        className="size-8 md:size-10"
      />
      <div className="flex items-center whitespace-nowrap">
        {imageStyleCategory.isGenerated && <AIStar />}
        {t(imageStyleCategory.title)}
      </div>
    </div>
  );
};

export default ImageStyleCategoryItem;

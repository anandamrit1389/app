import { getImagePlaceholderByTheme } from '@/helpers/utils/themes';
import { ISlide } from '@/interfaces/ISlides';
import { cn } from '@/lib/utils';
import { ImagePlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface IProps {
  theme: string;
  loading?: boolean;
  slide?: ISlide;
  isPreview?: boolean;
  onClick?: (event: React.MouseEvent) => void;
}

const EmptyImage = ({ theme, loading, slide, isPreview, onClick }: IProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });

  return (
    <div
      onClick={onClick}
      className="relative flex size-full items-center justify-center overflow-hidden"
      style={{
        backgroundColor: getImagePlaceholderByTheme(slide?.themeId || theme),
      }}
    >
      {loading ? (
        <div
          className={cn(
            'absolute inset-0 -top-[100%] h-[300%] w-full bg-gradient-to-r from-transparent via-white to-transparent animate-slide',
            {
              'opacity-10': theme === 'grey' || theme?.includes('dark'),
              'opacity-100': !(theme === 'grey' || theme?.includes('dark')),
            },
          )}
        />
      ) : (
        <div className="absolute">
          {slide && slide?.slideType === 'free-slide' && !isPreview && (
            <div className="flex flex-col justify-center items-center gap-2 size-full text-gray-300">
              <ImagePlus />
              <span>{t('clickToEdit')}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyImage;

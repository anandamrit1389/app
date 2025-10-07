import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { useTranslation } from 'react-i18next';
import useMobile from '@/hooks/useMobile';
import { GalleryImage, ImagesFilterValue } from '@/interfaces/images-gallery.interface';
import { downloadImage } from '@/helpers/utils/images';
import ImageItem from './ImageItem';
import NoImages from '@/assets/no-image.svg?react';

interface ImageGridProps {
  images: GalleryImage[];
  onGenerateNew: (image: GalleryImage) => void;
  onClick: (image: GalleryImage) => void;
  loading: boolean;
  activeFilter: ImagesFilterValue;
  onDelete: (image: GalleryImage) => void;
}

const ImageGrid = ({
  images,
  onGenerateNew,
  onClick,
  loading,
  activeFilter,
  onDelete,
}: ImageGridProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'dashboard' });
  const isMobile = useMobile();

  const handleDownload = async (image: GalleryImage) => {
    try {
      const response = await fetch(image.imageUrl);
      const blob = await response.blob();
      downloadImage(blob, image.id);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  if ((!images || images?.length === 0) && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <NoImages />
        {activeFilter === 'all' ||
          (activeFilter === 'ai' && (
            <>
              <h3 className="text-lg font-semibold">{t('noGeneratedImages')}</h3>
              <p>{t('addFirstImage')}</p>
            </>
          ))}
        {activeFilter === 'uploads' && (
          <h3 className="text-lg font-semibold">{t('noUploadedImages')}</h3>
        )}
        {activeFilter === 'web' && <h3 className="text-lg font-semibold">{t('noWebImages')}</h3>}
      </div>
    );
  }

  return (
    <ResponsiveMasonry
      className="pb-[200px]"
      columnsCountBreakPoints={{ 350: 2, 750: 2, 900: 3, 1200: 4 }}
    >
      <Masonry gutter={isMobile ? '4px' : '12px'}>
        {images.map((image) => (
          <ImageItem
            key={image.id}
            image={image}
            onClick={onClick}
            onDownload={handleDownload}
            onGenerateNew={onGenerateNew}
            onDelete={onDelete}
          />
        ))}
      </Masonry>
    </ResponsiveMasonry>
  );
};

export default ImageGrid;

import { GalleryImage, ImagesFilterValue } from '@/interfaces/images-gallery.interface';
import ImageGrid from './ImageGrid';
import Loader from '@/assets/loader-color.svg?react';
import { forwardRef } from 'react';

interface MainContentProps {
  loading: boolean;
  loadingMore: boolean;
  images: GalleryImage[];
  onScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  onGenerateNew: (image: GalleryImage) => void;
  onClick: (image: GalleryImage) => void;
  activeFilter: ImagesFilterValue;
  onDelete: (image: GalleryImage) => void;
}

const MainContent = forwardRef<HTMLDivElement, MainContentProps>(({
  loading,
  loadingMore,
  images,
  onScroll,
  onGenerateNew,
  onClick,
  activeFilter,
  onDelete,
}, ref) => {
  return (
    <div className="size-full overflow-y-auto" onScroll={onScroll} ref={ref}>
      {loading && !loadingMore ? (
        <div className="flex justify-center items-center py-10">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <>
          <ImageGrid
            images={images}
            onGenerateNew={onGenerateNew}
            onClick={onClick}
            loading={false}
            activeFilter={activeFilter}
            onDelete={onDelete}
          />
          {loadingMore && (
            <div className="flex justify-center py-4">
              <Loader className="animate-spin [&_path]:stroke-darkText" />
            </div>
          )}
        </>
      )}
    </div>
  );
});

MainContent.displayName = 'MainContent';

export default MainContent;

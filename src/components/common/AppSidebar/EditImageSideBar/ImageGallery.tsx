import UserGalleryService from '@/api/userGalleryService';
import { PresentationContext } from '@/contexts/Presentation.context';
import { DEFAULT_FILTER } from '@/helpers/constants/image-library.const';
import { useImageGallery } from '@/hooks/useImageGallery';
import useInfinityScroll from '@/hooks/useInfinityScroll';
import { GalleryImage } from '@/interfaces/images-gallery.interface';
import { useContext, useEffect } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

interface ImageGalleryProps {
  sidebarContainerRef: React.RefObject<HTMLDivElement>;
}

const ImageGallery = ({ sidebarContainerRef }: ImageGalleryProps) => {
  const { changeImageFromStock } = useContext(PresentationContext);

  const { images, loadingMore, loadMoreImages } = useImageGallery(DEFAULT_FILTER);

  const { handleNativeScroll } = useInfinityScroll({
    loadMore: loadMoreImages,
    isLoading: loadingMore,
    threshold: 0,
  });

  useEffect(() => {
    const sidebarElement = sidebarContainerRef.current;
    if (sidebarElement) {
      sidebarElement.addEventListener('scroll', handleNativeScroll);
      return () => {
        sidebarElement.removeEventListener('scroll', handleNativeScroll);
      };
    }
  }, [sidebarContainerRef, handleNativeScroll]);

  const handleClick = async (image: GalleryImage) => {
    const res = await UserGalleryService.generateImgUrlById(image.id);
    if (res) changeImageFromStock(res.imageUrl, res.imageKey, res.imageUrlGeneratedAt);
  };

  return (
    <div>
      <ResponsiveMasonry columnsCountBreakPoints={{ 0: 2 }}>
        <Masonry gutter="4px">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative cursor-pointer"
              onClick={() => handleClick(image)}
            >
              <img src={image.imageUrl} alt={image.id.toString()} className="w-full" />
              <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            </div>
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
};

export default ImageGallery;

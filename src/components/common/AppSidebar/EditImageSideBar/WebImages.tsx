import { PresentationContext } from '@/contexts/Presentation.context';
import useFetch from '@/hooks/useFetch';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import PhotostockService, { IGoogleImage } from '@/api/photostockService';
import Loader from '@/assets/loader-color.svg?react';
import { Button } from '@/components/ui/button';
import classNames from 'classnames';
import { getColorsByTheme } from '@/helpers/utils/websearch';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const WebImages = ({ reqStr, useTheme }: { reqStr: string; useTheme: boolean }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'search' });
  const { changeImageFromStock, theme } = useContext(PresentationContext);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [images, setImages] = useState<IGoogleImage[]>([]);
  const [totalPages, setTolalPages] = useState<number>(1);
  const [validImages, setValidImages] = useState<Set<string>>(new Set());
  const [loadingImage, setLoadingImage] = useState<string | null>(null);

  const imagesContainerRef = useRef<HTMLDivElement | null>(null);

  const {
    data: imagesData,
    loading: imagesLoading,
    error: imagesError,
  } = useFetch(
    PhotostockService.getWebImages,
    reqStr,
    pageNumber,
    10,
    useTheme ? getColorsByTheme(theme, 'google') : undefined,
  );

  useEffect(() => {
    if (imagesError) {
      toast.info(t('serviceError'));
    }
  }, [imagesError]);

  const handleChangeImage = async (image: string) => {
    try {
      setLoadingImage(image);
      const data = await PhotostockService.uploadImages(image);

      if (data && data.imageKey !== 'broken') {
        changeImageFromStock(data.imageUrl, data.imageKey, data.imageUrlGeneratedAt);
      } else {
        toast.error(t('errorLoadingImages'));
      }
    } catch (error) {
      toast.error(t('errorLoadingImages'));
    } finally {
      setLoadingImage(null);
    }
  };

  const handleScroll = useCallback(() => {
    const container = imagesContainerRef.current;

    if (
      container &&
      container.scrollTop + container.clientHeight >= container.scrollHeight - 10 &&
      !imagesLoading
    ) {
      if (totalPages > pageNumber) setPageNumber((prevPage) => prevPage + 1);
    }
  }, [imagesLoading, totalPages]);

  useEffect(() => {
    if (imagesLoading) return;
    if (imagesData?.results) {
      setImages((prevImages) => [...prevImages, ...imagesData.results]);
      setTolalPages(imagesData.total_pages);
    }
  }, [imagesData, imagesLoading]);

  useEffect(() => {
    setPageNumber(1);
    setImages([]);
    setValidImages(new Set());
  }, [reqStr, useTheme]);

  useEffect(() => {
    const container = imagesContainerRef.current;

    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  const handleImageError = (imageUrl: string) => {
    setValidImages((prev) => {
      const newSet = new Set(prev);
      newSet.delete(imageUrl);
      return newSet;
    });
  };

  const handleImageLoad = (imageUrl: string) => {
    setValidImages((prev) => {
      const newSet = new Set(prev);
      newSet.add(imageUrl);
      return newSet;
    });
  };

  return (
    <div
      ref={imagesContainerRef}
      className="mt-4 grid h-full grid-cols-2 gap-2 overflow-y-auto pb-[150px]"
    >
      {!imagesError &&
        images.map((image, index) => (
          <Button
            key={index}
            variant="ghost"
            className={classNames('relative size-full overflow-hidden p-0', {
              'col-span-2': index % 6 === 0,
              'row-span-2': index % 3 === 0,
            })}
            onClick={() => {
              handleChangeImage(image.image);
            }}
            disabled={loadingImage === image.image}
          >
            <div 
              className="w-full bg-gray-100"
              style={{ 
                paddingBottom: '75%',
                position: 'relative'
              }}
            >
              {(!validImages.has(image.image) || loadingImage === image.image) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader className="animate-spin" />
                </div>
              )}
              
              {image.image && (
                <img
                  src={image.image}
                  alt={image.description}
                  className="absolute inset-0 h-full w-full rounded-lg object-cover transition-opacity duration-300"
                  style={{ 
                    opacity: validImages.has(image.image) ? 1 : 0,
                    display: validImages.has(image.image) ? 'block' : 'none'
                  }}
                  onError={() => handleImageError(image.image)}
                  onLoad={() => handleImageLoad(image.image)}
                />
              )}
            </div>
          </Button>
        ))}
      {imagesLoading && (
        <div className="col-span-2 flex justify-center items-center py-10">
          <Loader className="animate-spin" />
        </div>
      )}
      {imagesError && !imagesLoading && <p>{t('errorLoadingImages')}</p>}
    </div>
  );
};

export default WebImages;

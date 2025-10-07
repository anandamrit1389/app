import { PresentationContext } from '@/contexts/Presentation.context';
import { getColorsByTheme } from '@/helpers/utils/websearch';
import useFetch from '@/hooks/useFetch';
import { useCallback, useContext, useEffect, useState } from 'react';
import PhotostockService, { IUnsplashImage } from '@/api/photostockService';
import Loader from '@/assets/loader-color.svg?react';
import { Button } from '@/components/ui/button';
import classNames from 'classnames';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface UnsplashImagesProps {
  reqStr: string;
  useTheme: boolean;
  sidebarContainerRef: React.RefObject<HTMLDivElement>;
}

const UnsplashImages = ({ reqStr, useTheme, sidebarContainerRef }: UnsplashImagesProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'search' });
  const { changeImageFromStock, theme } = useContext(PresentationContext);

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [images, setImages] = useState<IUnsplashImage[]>([]);
  const [totalPages, setTolalPages] = useState<number>(1);

  const {
    data: imagesData,
    loading: imagesLoading,
    error: imagesError,
  } = useFetch(
    PhotostockService.getUnsplashImages,
    reqStr,
    pageNumber,
    50,
    useTheme ? getColorsByTheme(theme, 'unsplash') : undefined,
  );

  useEffect(() => {
    if (imagesError) {
      toast.info(t('serviceError'));
    }
  }, [imagesError]);

  const handleScroll = useCallback(() => {
    const container = sidebarContainerRef.current;
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
  }, [reqStr, useTheme]);

  useEffect(() => {
    const container = sidebarContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  return (
    <div className="mt-4 grid h-full grid-cols-2 gap-2 overflow-y-auto pb-[150px]">
      {!imagesError &&
        images.map((image, index) => (
          <Button
            key={image.id}
            variant="ghost"
            className={classNames('size-full p-0', {
              'col-span-2': index % 6 === 0,
              'row-span-2': index % 3 === 0,
            })}
            onClick={() => {
              changeImageFromStock(image.urls.regular);
            }}
          >
            <img
              src={image.urls.thumb}
              alt={image.alt_description}
              className="size-full rounded-lg object-cover"
            />
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

export default UnsplashImages;

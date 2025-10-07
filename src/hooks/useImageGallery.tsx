import UserGalleryService from '@/api/userGalleryService';
import {
  GalleryImage,
  ImagesFilterValue,
  S3ImgCategory,
} from '@/interfaces/images-gallery.interface';
import { useState, useEffect } from 'react';

const ITEMS_PER_PAGE = 20;
interface IUseImageGallery {
  images: GalleryImage[];
  loading: boolean;
  loadingMore: boolean;
  loadMoreImages: () => void;
  hasMore: boolean;
  addNewImage: (image: GalleryImage) => void;
  deleteImage: (id: string) => Promise<void>;
}

export const useImageGallery = (activeFilter: ImagesFilterValue): IUseImageGallery => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const fetchImages = async (currentPage: number) => {
    setLoadingMore(true);

    try {
      const type = activeFilter === 'all' ? undefined : (activeFilter as S3ImgCategory);
      const response = await UserGalleryService.getUserImages(currentPage, ITEMS_PER_PAGE, type);

      const newImages = response.data.data;

      setImages((prevImages) => {
        const allImages = currentPage === 1 ? newImages : [...prevImages, ...newImages];

        const uniqueImages = allImages.filter(
          (img, index, self) => index === self.findIndex((i) => i.id === img.id),
        );

        return uniqueImages;
      });

      setHasMore(currentPage * ITEMS_PER_PAGE < response.data.total);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };
  const addNewImage = (image: GalleryImage) => {
    if (activeFilter === 'all' || activeFilter === image.type) {
      setImages((prevImages) => [image, ...prevImages]);
    }
  };

  useEffect(() => {
    setPage(1);
    setLoading(true);
    // setImages([]);
    setHasMore(true);
    fetchImages(1);
  }, [activeFilter]);

  useEffect(() => {
    if (page > 1 && hasMore) {
      fetchImages(page);
    }
  }, [page]);

  const loadMoreImages = () => {
    if (!loadingMore && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const deleteImage = async (id: string) => {
    try {
      await UserGalleryService.deleteImage(id);
      setImages((prevImages) => prevImages.filter((img) => img.id !== id));
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  return {
    images,
    loading,
    loadingMore,
    loadMoreImages,
    hasMore,
    addNewImage,
    deleteImage,
  };
};

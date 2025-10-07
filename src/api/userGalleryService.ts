import { AxiosResponse } from 'axios';
import apiService from '@/api/apiService';
import { ImageGalleryResponse, S3ImgCategory } from '@/interfaces/images-gallery.interface';
import { toast } from 'sonner';

export default class UserGalleryService {
  static getUserImages(
    page = 1,
    limit = 10,
    type?: S3ImgCategory,
  ): Promise<AxiosResponse<ImageGalleryResponse>> {
    return apiService.get('/user-gallery', {
      params: {
        page,
        limit,
        ...(type && { type }),
      },
    });
  }

  static uploadImage(url: string): Promise<AxiosResponse<{ imageUrl: string }>> {
    return apiService.post('/user-gallery', { url });
  }

  static generateImgUrlById(id: string): Promise<{
    imageKey: string;
    imageUrl: string;
    imageUrlGeneratedAt?: Date;
  }> {
    return apiService
      .get(`/user-gallery/${id}`)
      .then((response) => response.data)
      .catch((error) => {
        toast.error('Something went wrong :(', { description: error?.message });
      });
  }

  static deleteImage(id: string): Promise<AxiosResponse<void>> {
    return apiService.delete(`/user-gallery/${id}`);
  }
}

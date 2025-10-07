import { ImageStyleSlug } from './images-styles.interface';

export enum S3ImgCategory {
  AI_GENERATED = 'ai',
  UPLOADED = 'uploads',
  WEB_UPLOADED = 'web',
  CONVERTED_SLIDES = 'convertedSlides',
  OTHER = 'other',
}

export interface ImageGalleryResponse {
  data: GalleryImage[];
  total: number;
}

export interface GalleryImage {
  id: string;
  imageKey: string;
  imageUrl: string;
  type: S3ImgCategory;
  createdAt: string;
  canBeDeleted?: boolean;
}

export interface ImageResponse {
  imageKey: string;
  imageUrl: string;
  imageUrlGeneratedAt: Date;
}

export type ImageFilter = {
  id: number;
  value: ImagesFilterValue;
  labelKey: string;
};

export type ImagesFilterValue = 'all' | 'uploads' | 'ai' | 'web';

export interface TransformImageDto {
  prompt: string;
  imageUrl: string;
  imageStyle?: ImageStyleSlug;
}

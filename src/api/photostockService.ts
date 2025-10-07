import { AxiosResponse } from 'axios';
import apiService from '@/api/apiService';
import {
  GoogleColors,
  PexelsColors,
  PexelsOrientation,
  UnsplashColors,
  UnsplashOrientation,
} from '@/helpers/constants/image-search.const';
import { toast } from 'sonner';

export default class PhotostockService {
  static getUnsplashImages(
    query: string,
    page: number,
    perPage: number,
    color: UnsplashColors,
    orientation: UnsplashOrientation,
  ): Promise<AxiosResponse<IUnsplashResult>> {
    if (!query) {
      return Promise.resolve({ data: [] } as AxiosResponse);
    }

    const colorQuery = color ? `&color=${color}` : '';
    const orientationQuery = orientation ? `&orientation=${orientation}` : '';

    return apiService.get(
      `/photostock/unsplash?query=${query}&page=${page}&per_page=${perPage}${colorQuery}${orientationQuery}`,
    );
  }

  static getPexelsImages(
    query: string,
    page: number,
    perPage: number,
    color: PexelsColors,
    orientation: PexelsOrientation,
  ): Promise<AxiosResponse<IPexelsResult>> {
    if (!query) {
      return Promise.resolve({ data: [] } as AxiosResponse);
    }
    const colorQuery = color ? `&color=${color}` : '';
    const orientationQuery = orientation ? `&orientation=${orientation}` : '';
    return apiService.get(
      `/photostock/pexels?query=${query}&page=${page}&per_page=${perPage}${colorQuery}${orientationQuery}`,
    );
  }

  static getWebImages(
    query: string,
    page: number,
    perPage: number,
    color: GoogleColors,
  ): Promise<AxiosResponse<IGoogleResult>> {
    const colorQuery = color ? `&color=${color}` : '';

    return apiService.get(
      `/photostock/web?query=${query}&page=${page}&per_page=${perPage}${colorQuery}`,
    );
  }

  static uploadImages(url: string): Promise<{
    imageUrl: string;
    imageKey: string;
    imageUrlGeneratedAt?: Date;
  }> {
    return apiService
      .post(`/user-gallery/`, {
        url: url,
      })
      .then((response) => response.data)
      .catch((error) => {
        toast.error('Something went wrong :(', { description: error?.message });
      });
  }
}

export interface IDuckDuckResult {
  height: number;
  image: string;
  image_token: string;
  source: string;
  thumbnail: string;
  thumbnail_token: string;
  title: string;
  url: string;
  width: number;
}

export interface IUnsplashResult {
  results: IUnsplashImage[];
  total: number;
  total_pages: number;
}

export interface IPexelsResult {
  page: number;
  per_page: number;
  photos: IPexelsImage[];
  total_results: number;
}

export interface IGoogleResult {
  results: IGoogleImage[];
  total: number;
  total_pages: number;
}

export interface IUnsplashImage {
  id: string;
  slug: string;
  alternative_slugs: AlternativeSlugs;
  created_at: string;
  updated_at: string;
  promoted_at: string | null;
  width: number;
  height: number;
  color: string;
  blur_hash: string;
  description: string | null;
  alt_description: string;
  urls: Urls;
  links: Links;
  likes: number;
  liked_by_user: boolean;
  asset_type: string;
  user: User;
  tags: Tag[];
}

export interface IPexelsImage {
  id: number;
  alt: string;
  avg_color: string;
  height: number;
  width: number;
  liked: boolean;
  photographer: string;
  photographer_id: number;
  photographer_url: string;
  src: Src;
  url: string;
}

export interface IGoogleImage {
  image: string;
  description: string;
}

export interface AlternativeSlugs {
  en: string;
  es: string;
  ja: string;
  fr: string;
  it: string;
  ko: string;
  de: string;
  pt: string;
}

export interface Urls {
  raw: string;
  full: string;
  regular: string;
  small: string;
  thumb: string;
  small_s3: string;
}

export interface Src {
  landscape: string;
  large: string;
  large2x: string;
  medium: string;
  original: string;
  portrait: string;
  small: string;
  tiny: string;
}

export interface Links {
  self: string;
  html: string;
  download: string;
  download_location: string;
}

export interface ProfileImage {
  small: string;
  medium: string;
  large: string;
}

export interface Social {
  instagram_username: string;
  portfolio_url: string;
  twitter_username: string;
  paypal_email: string | null;
}

export interface User {
  id: string;
  updated_at: string;
  username: string;
  name: string;
  first_name: string;
  last_name: string;
  twitter_username: string;
  portfolio_url: string;
  bio: string;
  location: string;
  links: Links;
  profile_image: ProfileImage;
  instagram_username: string;
  total_collections: number;
  total_likes: number;
  total_photos: number;
  total_promoted_photos: number;
  total_illustrations: number;
  total_promoted_illustrations: number;
  accepted_tos: boolean;
  for_hire: boolean;
  social: Social;
}

export interface Tag {
  type: string;
  title: string;
}

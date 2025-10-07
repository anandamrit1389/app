import { ImageFilter, ImagesFilterValue } from '@/interfaces/images-gallery.interface';

export const IMAGE_LIBRARY_FILTERS: ImageFilter[] = [
  { id: 1, value: 'all', labelKey: 'all' },
  { id: 2, value: 'uploads', labelKey: 'uploads' },
  { id: 3, value: 'ai', labelKey: 'aiGenerated' },
  { id: 4, value: 'web', labelKey: 'webSearch' },
];

export const DEFAULT_FILTER: ImagesFilterValue = 'all';

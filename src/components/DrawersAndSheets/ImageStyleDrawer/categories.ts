import MostPopularThumb from '@/assets/image-styles/most-popular-thumb.png';
import RealisticThumb from '@/assets/image-styles/realist-thumb.png';
import ArtisticThumb from '@/assets/image-styles/artistic-thumb.png';
import CartoonThumb from '@/assets/image-styles/cartoon-thumb.png';
import AbstractThumb from '@/assets/image-styles/abstract-thumb.png';
import realPhotographyThumb from '@/assets/image-styles/real-photography-thumb.png';

import WebStockPhotosOnly from '@/assets/image-styles/web_stock_photos_only.jpg';
import MixAIAndWeb from '@/assets/image-styles/mix_ai_and_web.jpg';
import RealisticAi from '@/assets/image-styles/realistic_ai.jpg';
import Surreal from '@/assets/image-styles/surreal.jpg';
import Minimalistic from '@/assets/image-styles/minimalistic.jpg';
import Abstract from '@/assets/image-styles/abstract.jpg';
import Comic2d from '@/assets/image-styles/2d_comic.jpg';
import AnimatedStyle from '@/assets/image-styles/3d_animated_style.jpg';
import StilelisedClean from '@/assets/image-styles/stilelised_clean.jpg';
import Cyberpunk from '@/assets/image-styles/cyberpunk.jpg';
import Documentery from '@/assets/image-styles/documentery.jpg';
import Glamore from '@/assets/image-styles/glamore.jpg';
import {
  ImageStyle,
  ImageStyleCategory,
  ImageStyleSlug,
} from '@/interfaces/images-styles.interface';

export const imageStyleCategories: ImageStyleCategory[] = [
  {
    id: 1,
    title: 'mostPopular',
    thumbSrc: MostPopularThumb,
    isGenerated: true,
  },
  {
    id: 2,
    title: 'webAndStock',
    thumbSrc: realPhotographyThumb,
    isGenerated: true,
  },
  {
    id: 3,
    title: 'realisticAI',
    thumbSrc: RealisticThumb,
    isGenerated: true,
  },
  {
    id: 4,
    title: 'artistic',
    thumbSrc: ArtisticThumb,
    isGenerated: true,
  },
  {
    id: 5,
    title: 'cartoon',
    thumbSrc: CartoonThumb,
    isGenerated: true,
  },
  {
    id: 6,
    title: 'thematic',
    thumbSrc: AbstractThumb,
    isGenerated: true,
  },
];

export const imageStylesList: ImageStyle[] = [
  {
    id: 1,
    slug: ImageStyleSlug.WebStockPhotosOnly,
    title: 'webAndStockOnly',
    categoryId: 2,
    thumbSrc: WebStockPhotosOnly,
    isGenerated: true,
    isPopular: true,
  },
  {
    id: 2,
    slug: ImageStyleSlug.MixAIAndWeb,
    title: 'mixAIWeb',
    categoryId: 3,
    thumbSrc: MixAIAndWeb,
    isGenerated: true,
  },
  {
    id: 3,
    slug: ImageStyleSlug.RealisticAI,
    title: 'realisticAI',
    categoryId: 3,
    thumbSrc: RealisticAi,
    isGenerated: true,
    isPopular: true,
  },
  {
    id: 4,
    slug: ImageStyleSlug.Surreal,
    title: 'surreal',
    categoryId: 4,
    thumbSrc: Surreal,
    isGenerated: true,
  },
  {
    id: 5,
    slug: ImageStyleSlug.Minimalistic,
    title: 'minimalistic',
    categoryId: 4,
    thumbSrc: Minimalistic,
    isGenerated: true,
  },
  {
    id: 6,
    slug: ImageStyleSlug.Abstract,
    title: 'abstract',
    categoryId: 4,
    thumbSrc: Abstract,
    isGenerated: true,
  },
  {
    id: 7,
    slug: ImageStyleSlug.Comic2D,
    title: '2Dcomic',
    categoryId: 5,
    thumbSrc: Comic2d,
    isGenerated: true,
  },
  {
    id: 8,
    slug: ImageStyleSlug.AnimatedStyle3D,
    title: '3DanimatedStyle',
    categoryId: 5,
    thumbSrc: AnimatedStyle,
    isGenerated: true,
  },
  {
    id: 9,
    slug: ImageStyleSlug.StylizedClean,
    title: 'stilelisedClean',
    categoryId: 5,
    thumbSrc: StilelisedClean,
    isGenerated: true,
  },
  {
    id: 10,
    slug: ImageStyleSlug.Cyberpunk,
    title: 'cyberPunk',
    categoryId: 6,
    thumbSrc: Cyberpunk,
    isGenerated: true,
    isPopular: true,
  },
  {
    id: 11,
    slug: ImageStyleSlug.Documentary,
    title: 'documentery',
    categoryId: 6,
    thumbSrc: Documentery,
    isGenerated: true,
  },
  {
    id: 12,
    slug: ImageStyleSlug.Glamore,
    title: 'glamore',
    categoryId: 6,
    thumbSrc: Glamore,
    isGenerated: true,
  },
];

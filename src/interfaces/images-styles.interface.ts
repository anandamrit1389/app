export enum ImageStyleSlug {
  WebStockPhotosOnly = 'web_stock_photos_only',
  MixAIAndWeb = 'mix_ai_and_web',
  RealisticAI = 'realistic_ai',
  Surreal = 'surreal',
  Minimalistic = 'minimalistic',
  Abstract = 'abstract',
  Comic2D = '2d_comic',
  AnimatedStyle3D = '3d_animated_style',
  StylizedClean = 'stilelised_clean',
  Cyberpunk = 'cyberpunk',
  Documentary = 'documentery',
  Glamore = 'glamore',
}

export interface ImageStyle {
  id: number;
  slug: ImageStyleSlug;
  title: string;
  categoryId?: number;
  thumbSrc: string;
  isGenerated: boolean;
  isPopular?: boolean;
}

export interface ImageStyleCategory {
  id: number;
  title: string;
  thumbSrc: string;
  isGenerated: boolean;
}

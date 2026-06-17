import type { CarouselSlide } from '@/types/carousel';
import { assetUrl, type AssetParams } from './assets';

const COMMON: AssetParams = { format: 'webp', quality: 80 };

export interface SlideSources {
  mobile: string;
  tablet: string;
  desktop: string;
}

export function slideSources(slide: CarouselSlide): SlideSources {
  return {
    mobile: assetUrl(slide.img_mobile, { ...COMMON, width: 768 }),
    tablet: assetUrl(slide.img_tablet, { ...COMMON, width: 1280 }),
    desktop: assetUrl(slide.img_desktop, { ...COMMON, width: 1920 }),
  };
}

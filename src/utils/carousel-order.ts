import type { CarouselSlide } from '@/types/carousel';

export interface CarouselOrder {
  featured: CarouselSlide[];
  normal: CarouselSlide[];
}

export function buildCarouselOrder(slides: CarouselSlide[]): CarouselOrder {
  const bySort = (a: CarouselSlide, b: CarouselSlide) =>
    (a.sort ?? 0) - (b.sort ?? 0);
  return {
    featured: slides.filter(s => s.is_featured).sort(bySort),
    normal: slides.filter(s => !s.is_featured).sort(bySort),
  };
}

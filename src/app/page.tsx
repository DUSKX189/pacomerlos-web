import CarouselSlide from '@/components/layout/LandingPage/Hero/CarouselSlide';
import HeroCarousel from '@/components/layout/LandingPage/Hero/HeroCarousel';
import MainBanner from '@/components/layout/LandingPage/Hero/MainBanner';
import Conector from '@/components/ui/LangingPage/conector';
import { getCarouselSlides, getPaquitos } from '@/lib/directus/queries';
import { buildCarouselOrder } from '@/utils/carousel-order';
import PaquitosGalery from '@/components/layout/LandingPage/PaquitoGalery/paquitosGalery';

export const revalidate = 30;

export default async function Home() {
  const [slides, paquitos] = await Promise.all([getCarouselSlides(), getPaquitos()]);
  const { featured, normal } = buildCarouselOrder(slides);

  return (
    <>
      <HeroCarousel>
        {featured.map((slide, i) => (
          <CarouselSlide key={slide.id} slide={slide} priority={i === 0} />
        ))}
        <MainBanner />
        {normal.map((slide, i) => (
          <CarouselSlide
            key={slide.id}
            slide={slide}
            priority={featured.length === 0 && i === 0}
          />
        ))}
      </HeroCarousel>
      <Conector />
      <PaquitosGalery paquitos={paquitos} />
    </>
  );
}

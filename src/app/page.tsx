import HeroCarousel from '@/components/layout/Hero/HeroCarousel';
import MainBanner from '@/components/layout/Hero/MainBanner';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <HeroCarousel>
      <MainBanner />
    </HeroCarousel>
  );
}

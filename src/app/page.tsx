import CarouselSlide, { type Slide } from '@/components/layout/Hero/CarouselSlide';
import HeroCarousel from '@/components/layout/Hero/HeroCarousel';
import MainBanner from '@/components/layout/Hero/MainBanner';

export const revalidate = 30;

const SLIDES_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL_CAROUSEL_SLIDES;
const COLOR_FALLBACK = '#0F0F0F';

type DirectusCarouselSlide = Omit<Slide, 'title_color' | 'description_color'> & {
  title_color_preset: string | null;
  title_color_custom: string | null;
  description_color_preset: string | null;
  description_color_custom: string | null;
};

function toSlide(raw: DirectusCarouselSlide): Slide {
  const {
    title_color_preset,
    title_color_custom,
    description_color_preset,
    description_color_custom,
    ...rest
  } = raw;
  return {
    ...rest,
    title_color: title_color_custom ?? title_color_preset ?? COLOR_FALLBACK,
    description_color: description_color_custom ?? description_color_preset ?? COLOR_FALLBACK,
  };
}

async function getSlides(): Promise<Slide[]> {
  const statusFilter =
    process.env.NODE_ENV === 'development'
      ? 'filter[status][_in]=draft,published'
      : 'filter[status][_eq]=published';

  const fields = [
    'id', 'sort', 'is_featured',
    'title', 'description', 'button_function',
    'img_mobile', 'img_tablet', 'img_desktop',
    'title_color_preset', 'title_color_custom',
    'description_color_preset', 'description_color_custom',
  ].join(',');

  try {
    const url = `${SLIDES_URL}?${statusFilter}&fields=${fields}`;
    const res = await fetch(url, { next: { revalidate: 30 } });
    if (!res.ok) return [];
    const { data } = (await res.json()) as { data: DirectusCarouselSlide[] };
    if (process.env.NODE_ENV === 'development') logSlides(url, data);
    return data.map(toSlide);
  } catch {
    return [];
  }
}

function logSlides(url: string, data: DirectusCarouselSlide[]) {
  console.log('\n[carousel_slides] GET', url);
  console.log(`[carousel_slides] ${data.length} item(s)`);
  console.table(
    data.map(s => ({
      id: s.id,
      sort: s.sort,
      is_featured: s.is_featured,
      title: s.title,
      title_color_custom: s.title_color_custom,
      title_color_preset: s.title_color_preset,
      description_color_custom: s.description_color_custom,
      description_color_preset: s.description_color_preset,
    })),
  );
}

export default async function Home() {
  const slides = await getSlides();

  const bySort = (a: Slide, b: Slide) => (a.sort ?? 0) - (b.sort ?? 0);
  const featured = slides.filter(s => s.is_featured).sort(bySort);
  const normal = slides.filter(s => !s.is_featured).sort(bySort);

  return (
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
  );
}
import type { CarouselSlide, CarouselSlideRaw } from '@/types/carousel';
import type { Paquito } from '@/types/paquitos';
import { directusFetch } from './client';
import { contentEnv, statusFilter } from './status';

const COLOR_FALLBACK = '#0F0F0F';

const CAROUSEL_FIELDS = [
  'id', 'sort', 'is_featured',
  'title', 'description', 'button_function',
  'img_mobile', 'img_tablet', 'img_desktop',
  'title_color_preset', 'title_color_custom',
  'description_color_preset', 'description_color_custom',
].join(',');

// paquitos_data no tiene campo `status` documentado en CLAUDE.md,
// por eso aquí no se aplica statusFilter. Si en el futuro se añade,
// basta con incluir ...statusFilter() en los params.
const PAQUITO_FIELDS = [
  'id', 'name', 'tagline', 'image_main',
  'general_description', 'interior_description', 'topping_description',
  'primary_color', 'secondary_color',
  'allergens', 'cross_contact',
].join(',');

function toCarouselSlide(raw: CarouselSlideRaw): CarouselSlide {
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
    description_color:
      description_color_custom ?? description_color_preset ?? COLOR_FALLBACK,
  };
}

export async function getCarouselSlides(): Promise<CarouselSlide[]> {
  try {
    const { data } = await directusFetch<CarouselSlideRaw[]>(
      '/items/carousel_slides',
      { params: { ...statusFilter(), fields: CAROUSEL_FIELDS } },
    );
    if (contentEnv() === 'development') logCarouselSlides(data);
    return data.map(toCarouselSlide);
  } catch (err) {
    console.error('[getCarouselSlides]', err);
    return [];
  }
}

export async function getPaquitos(): Promise<Paquito[]> {
  try {
    const { data } = await directusFetch<Paquito[]>('/items/paquitos_data', {
      params: { fields: PAQUITO_FIELDS },
    });
    return data;
  } catch (err) {
    console.error('[getPaquitos]', err);
    return [];
  }
}

function logCarouselSlides(data: CarouselSlideRaw[]) {
  console.log(`\n[carousel_slides] ${data.length} item(s)`);
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

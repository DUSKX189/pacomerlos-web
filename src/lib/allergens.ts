import type { AllergenSlug } from '@/types/paquitos';

/**
 * Etiqueta legible para cada alérgeno. El backend devuelve solo el slug
 * (p. ej. "leche") y el frontend lo normaliza a su nombre completo.
 */
export const ALLERGEN_LABELS: Record<AllergenSlug, string> = {
  frutos: 'Frutos con cáscara',
  gluten: 'Cereales con gluten',
  huevo: 'Huevo y derivados',
  leche: 'Leche y productos lácteos',
  soja: 'Soja y derivados',
  sulfitos: 'Sulfitos',
};

/** Ruta del icono SVG en /public/icons/alergenos/<slug>.svg */
export function allergenIcon(slug: AllergenSlug): string {
  return `/icons/alergenos/${slug}.svg`;
}

export interface Allergen {
  slug: AllergenSlug;
  label: string;
  icon: string;
}

/** Normaliza un slug de la API a su forma completa para el frontend. */
export function normalizeAllergen(slug: AllergenSlug): Allergen {
  return {
    slug,
    label: ALLERGEN_LABELS[slug],
    icon: allergenIcon(slug),
  };
}

export function normalizeAllergens(
  slugs: AllergenSlug[] | null | undefined,
): Allergen[] {
  return (slugs ?? []).map(normalizeAllergen);
}
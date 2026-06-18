/**
 * Slugs de alérgenos. Cada uno corresponde a un icono en
 * /public/icons/alergenos/<slug>.svg
 */
export type AllergenSlug =
  | "frutos"
  | "gluten"
  | "huevo"
  | "leche"
  | "soja"
  | "sulfitos";

export interface Paquito {
  id: number;
  name: string;
  tagline: string | null;
  image_main: string;
  general_description: string | null;
  interior_description: string | null;
  topping_description: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  /** Alérgenos presentes en el producto */
  allergens: AllergenSlug[] | null;
  /** Alérgenos por contaminación cruzada (trazas) */
  cross_contact: AllergenSlug[] | null;
}

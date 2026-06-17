export interface CarouselSlideRaw {
  id: number;
  sort: number | null;
  is_featured: boolean;
  title: string;
  description: string | null;
  button_function: string | null;
  img_mobile: string;
  img_tablet: string;
  img_desktop: string;
  title_color_preset: string | null;
  title_color_custom: string | null;
  description_color_preset: string | null;
  description_color_custom: string | null;
}

export interface CarouselSlide {
  id: number;
  sort: number | null;
  is_featured: boolean;
  title: string;
  description: string | null;
  button_function: string | null;
  img_mobile: string;
  img_tablet: string;
  img_desktop: string;
  title_color: string;
  description_color: string;
}

const DIRECTUS_IMG_URL = process.env.NEXT_PUBLIC_DIRECTUS_IMG_URL;

export interface Slide {
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

function assetUrl(uuid: string, width: number, quality = 80) {
  return `${DIRECTUS_IMG_URL}${uuid}?width=${width}&format=webp&quality=${quality}`;
}

interface CarouselSlideProps {
  slide: Slide;
  priority?: boolean;
}

export default function CarouselSlide({ slide, priority = false }: CarouselSlideProps) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <picture>
        <source
          media="(min-width: 1024px)"
          srcSet={assetUrl(slide.img_desktop, 1920)}
        />
        <source
          media="(min-width: 768px)"
          srcSet={assetUrl(slide.img_tablet, 1280)}
        />
        <img
          src={assetUrl(slide.img_mobile, 768)}
          alt=""
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover select-none"
        />
      </picture>
      <div className="absolute inset-0 z-10 flex flex-col items-start justify-end padding-responsive pb-16 md:items-center md:justify-center md:pb-0 md:text-center">
        <h2
          className="font-chunko text-4xl uppercase leading-tight md:text-5xl lg:text-8xl md:max-w-2xl lg:max-w-4xl"
          style={{ color: slide.title_color }}
        >
          {slide.title}
        </h2>
        {slide.description && (
          <p
            className="mt-3 max-w-lg text-xl md:text-2xl"
            style={{ color: slide.description_color }}
          >
            {slide.description}
          </p>
        )}
      </div>
    </div>
  );
}

import Image from 'next/image';

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

function assetUrl(uuid: string) {
  return `${DIRECTUS_IMG_URL}${uuid}`;
}

interface CarouselSlideProps {
  slide: Slide;
  priority?: boolean;
}

export default function CarouselSlide({ slide, priority = false }: CarouselSlideProps) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <Image
        src={assetUrl(slide.img_mobile)}
        alt=""
        fill
        sizes="100vw"
        priority={priority}
        className="object-cover md:hidden"
      />
      <Image
        src={assetUrl(slide.img_tablet)}
        alt=""
        fill
        sizes="100vw"
        priority={priority}
        className="hidden object-cover md:block lg:hidden"
      />
      <Image
        src={assetUrl(slide.img_desktop)}
        alt=""
        fill
        sizes="100vw"
        priority={priority}
        className="hidden object-cover lg:block"
      />
      <div className="absolute inset-0 z-10 flex flex-col items-start justify-end padding-responsive pb-16 md:items-center md:justify-center md:pb-0 md:text-center">
        <h2
          className="font-chunko text-4xl uppercase leading-tight md:text-5xl lg:text-8xl"
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
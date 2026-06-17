import Image from 'next/image';
import type { Paquito } from '@/types/paquitos';
import { assetUrl } from '@/lib/directus/assets';

interface PaquitoHintProps {
  paquito: Paquito;
}

export default function PaquitoHint({ paquito }: PaquitoHintProps) {
  return (
    <div className="flex w-full items-center justify-center">
      <Image
        src={assetUrl(paquito.image_main, { width: 600, format: 'webp', quality: 80 })}
        alt={paquito.name}
        width={600}
        height={600}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        unoptimized
        draggable={false}
        className="h-auto w-full object-contain select-none"
      />
    </div>
  );
}

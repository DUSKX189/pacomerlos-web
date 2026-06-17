import Image from 'next/image';
import PaquitosCarousel from './paquitosCarousel';
import type { Paquito } from '@/types/paquitos';

interface PaquitosGaleryProps {
  paquitos: Paquito[];
}

export default function PaquitosGalery({ paquitos }: PaquitosGaleryProps) {
  return (
    <section className="flex flex-col justify-center items-center py-10">
      <div className="w-full flex justify-center items-center gap-4 opacity-80 text-paco-orange">
        <div className="side-bars" />
        <p className="text-center text-lg uppercase tracking-widest font-now">Nuestros Sabores</p>
        <div className="side-bars" />
      </div>
      <h2 className="text-4xl md:text-5xl lg:text-9xl font-chunko uppercase text-center mt-3 max-w-4xl text-paco-orange">
        Conoce cada uno
      </h2>
      <Image
        src="/icons/flecha-hacia-abajo.svg"
        alt=""
        aria-hidden="true"
        width={40}
        height={40}
        className="mt-2 h-8 w-8 md:h-10 md:w-10"
      />
      <PaquitosCarousel paquitos={paquitos} />
    </section>
  );
}

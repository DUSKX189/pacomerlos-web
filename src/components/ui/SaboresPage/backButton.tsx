import Link from 'next/link';
import Image from 'next/image';

export default function BackButton() {
  return (
    <Link href="/">
      <span className="flex items-center">
        <Image src="/icons/atras.svg" alt="Atrás" width={18} height={18} />
        <p className='font-now text-lg text-paco-purple-dark'>Volver</p>
      </span>
    </Link>
  );
}
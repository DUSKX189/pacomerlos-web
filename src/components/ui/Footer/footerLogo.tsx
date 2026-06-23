import Image from 'next/image';
import Link from 'next/link';

export default function FooterLogo() {
  return (
    <Link href="/" className="flex items-center justify-center" aria-label="Paco Merlos — Inicio">
      <Image
        src="/img/logos/hero-10.svg"
        alt="Paco Merlos"
        width={290}
        height={200}
        className="h-auto w-90 md:w-110"
      />
    </Link>
  );
}

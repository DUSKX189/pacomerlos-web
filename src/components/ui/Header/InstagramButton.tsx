import Link from "next/link";
import Image from "next/image";

export default function InstagramButton() {
  return (
    <Link
      href="https://www.instagram.com/paco_merlos/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Instagram de Paco Merlos"
      className="flex text-paco-orange transition-transform duration-150 hover:scale-110 md:hidden"
    >
      <Image
        src="/icons/instagram.svg"
        alt="Instagram de Paco Merlos"
        width={30}
        height={30}
      />
    </Link>
  );
}

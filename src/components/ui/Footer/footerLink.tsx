import Link from 'next/link';

export default function FooterLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="text-paco-cream md:text-lg hover:text-paco-orange/80 transition-colors duration-300 font-now"
    >
      {children}
    </Link>
  );
}
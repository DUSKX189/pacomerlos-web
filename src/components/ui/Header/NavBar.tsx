import Link from 'next/link';

const NAV_LINKS = [
  { name: 'Sabores',        href: '/sabores',         external: false },
  { name: 'Sobre Nosotros', href: '/sobre-nosotros',  external: false },
  { name: 'Pacommunity',    href: '/pacommunity',     external: false },
  { name: 'Síguenos',       href: 'https://www.instagram.com/paco_merlos/', external: true },
] as const;

export default function NavBar() {
  return (
    <nav className="hidden md:block">
      <ul className="flex items-center gap-1">
        {NAV_LINKS.map(({ name, href, external }) => (
          <li key={name}>
            <Link
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              className={`navlink ${external ? 'navlink-external' : ''}`}
            >
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

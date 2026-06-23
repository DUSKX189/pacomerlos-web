import FooterLink from './footerLink';

export interface FooterNavLink {
  name: string;
  href: string;
  external?: boolean;
}

interface NavContainerProps {
  name: string;
  links: FooterNavLink[];
}

export default function NavContainer({ name, links }: NavContainerProps) {
  return (
    <nav className="flex flex-col gap-4 items-start">
      <p className="font-now text-lg lg:text-3xl font-semibold text-paco-cream uppercase">{name}</p>
      <ul className="flex flex-col gap-2 items-start">
        {links.map((link) => (
          <li key={link.href}>
            <FooterLink href={link.href} external={link.external}>
              {link.name}
            </FooterLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

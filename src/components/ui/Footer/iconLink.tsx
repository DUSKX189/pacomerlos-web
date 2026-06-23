import Link from "next/link";
import type { CSSProperties } from "react";

interface IconLinkProps {
  href: string;
  icon: string;        // nombre del archivo, p. ej. "github.svg"
  label: string;
  hoverColor?: string;
}

export function IconLink({ href, icon, label, hoverColor }: IconLinkProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="icon-link"
      style={
        {
          "--icon": `url(/icons/redes/${icon})`,
          "--hover": hoverColor,
        } as CSSProperties
      }
    />
  );
}
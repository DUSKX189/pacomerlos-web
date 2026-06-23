import type { CSSProperties } from 'react';

interface IconDataProps {
  icon: string; // nombre del archivo en /public/icons, p. ej. "llamar.svg"
  children: React.ReactNode;
}

export default function IconData({ icon, children }: IconDataProps) {
  return (
    <span className="flex items-center gap-1 text-paco-cream font-now lg:text-lg">
      <span
        className="icon-data"
        style={{ '--icon': `url(/icons/${icon})` } as CSSProperties}
        aria-hidden="true"
      />
      <span>{children}</span>
    </span>
  );
}

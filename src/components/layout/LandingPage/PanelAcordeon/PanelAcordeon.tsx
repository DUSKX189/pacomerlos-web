'use client';

import { useEffect, useState } from 'react';

/** Paneles del acordeón. Por ahora sin contenido; se diferencian por color. */
const PANELS = [
  { id: 'panel-1', color: 'var(--paco-purple)' },
  { id: 'panel-2', color: 'var(--paco-orange)' },
  { id: 'panel-3', color: 'var(--paco-purple-dark)' },
];

const DESKTOP_MQ = '(min-width: 1024px)';

export default function PanelAcordeon() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // En escritorio la expansión es por hover (CSS puro); el estado `active` solo
  // gobierna móvil/tablet. Al cruzar a escritorio reseteamos para que el hover
  // tome el control limpio (mismo comportamiento que la demo).
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_MQ);
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setActiveIndex(null);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const toggle = (i: number) => {
    // Solo gobierna móvil/tablet; en escritorio manda el hover.
    if (window.matchMedia(DESKTOP_MQ).matches) return;
    setActiveIndex((prev) => (prev === i ? null : i));
  };

  return (
    <section className="relative z-20 w-full bg-paco-orange py-16 lg:py-24">
      <div className="acc-stage mx-auto h-[80vh] w-full max-w-480 overflow-hidden lg:h-[70vh] min-[120rem]:px-8 min-[160rem]:px-16">
        {PANELS.map((panel, i) => (
          <article
            key={panel.id}
            className={`acc-panel${activeIndex === i ? ' active' : ''}`}
            style={{ backgroundColor: panel.color }}
            role="button"
            tabIndex={0}
            aria-expanded={activeIndex === i}
            onClick={() => toggle(i)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle(i);
              }
            }}
          />
        ))}
      </div>
    </section>
  );
}

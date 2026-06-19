'use client';

import { Children, useEffect, useRef, type ReactNode } from 'react';

interface StackedCardsProps {
  /** Altura (px) a la que se fijan las tarjetas. Deben quedar debajo del Header. */
  topOffset?: number;
  /** Separación entre tarjetas y desplazamiento de la pila (px). */
  gap?: number;
  /** Intensidad del escalado. */
  scaleFactor?: number;
  children: ReactNode;
}

export default function StackedCards({
  topOffset = 96,
  gap = 24,
  scaleFactor = 0.05,
  children,
}: StackedCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Respeto a prefers-reduced-motion y soporte de IntersectionObserver:
    // si no se cumple, dejamos las tarjetas en flujo normal (sin efecto).
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const cards = Array.from(
      container.querySelectorAll<HTMLElement>('[data-stack-card]')
    );
    if (cards.length === 0) return;

    const lastIndex = cards.length - 1;

    // El efecto solo se activa donde las tarjetas caben en el viewport (md+),
    // que coincide con el layout flex-row de PacoCard. En móvil (flex-col) las
    // tarjetas son más altas que la pantalla: apilarlas impediría leerlas, así
    // que se quedan en flujo normal.
    const desktopMql = window.matchMedia('(min-width: 768px)');

    // Altura uniforme de todas las tarjetas (la de la más alta). Es la CLAVE para
    // que no haya glitch: position:sticky acota cada tarjeta por el borde inferior
    // del contenedor; una tarjeta se despega cuando ese borde llega a
    // `topOffset + suAltura`. Si todas comparten contenedor y tienen alturas
    // distintas, se despegan en momentos distintos (la más alta primero) → saltan.
    // Igualando la altura, el límite coincide para todas y se sueltan a la vez.
    let cardHeight = 0;
    let ticking = false;
    let active = false;

    // Mide el contenido natural (el hijo de cada wrapper) y aplica la altura
    // uniforme + el translateY base de la pila + el padding inferior del
    // contenedor (reserva el staircase gap*lastIndex).
    const measure = () => {
      const heights = cards.map((card) => {
        const content = card.firstElementChild as HTMLElement | null;
        return content ? content.offsetHeight : card.offsetHeight;
      });
      cardHeight = Math.max(...heights);

      cards.forEach((card, i) => {
        card.style.height = `${cardHeight}px`;
        card.style.top = `${topOffset}px`;
        card.style.transform = `translateY(${gap * i}px)`;
      });

      const paddingBottom = `${gap * lastIndex}px`;
      if (container.style.paddingBottom !== paddingBottom) {
        container.style.paddingBottom = paddingBottom;
      }
    };

    const update = () => {
      ticking = false;
      const containerTop = container.getBoundingClientRect().top;

      cards.forEach((card, i) => {
        const scrolling = topOffset - containerTop - i * (cardHeight + gap);

        if (scrolling > 0) {
          // La tarjeta está fijada: mantenemos su translateY y la escalamos.
          // La última nunca se escala (queda como tarjeta "base" de la pila).
          const scale =
            i === lastIndex
              ? 1
              : (cardHeight - scrolling * scaleFactor) / cardHeight;
          card.style.transform = `translateY(${gap * i}px) scale(${scale})`;
        } else {
          // Aún en flujo normal: solo el translateY base, sin escalado.
          card.style.transform = `translateY(${gap * i}px)`;
        }
      });
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    // Solo enganchamos el listener de scroll cuando el contenedor está en pantalla.
    const intersectionObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          window.addEventListener('scroll', onScroll, { passive: true });
          update();
        } else {
          window.removeEventListener('scroll', onScroll);
        }
      }
    });

    // Re-mide cuando cambian las alturas del CONTENIDO (carga de imágenes async,
    // reflujo de texto…). Observamos el contenido —no el wrapper de altura fija—
    // para no entrar en bucle al reasignar la altura.
    const resizeObserver = new ResizeObserver(() => {
      if (!active) return;
      measure();
      update();
    });

    const enable = () => {
      if (active) return;
      active = true;
      cards.forEach((card) => {
        card.style.position = 'sticky';
        const content = card.firstElementChild;
        if (content) resizeObserver.observe(content);
      });
      measure();
      update();
      intersectionObserver.observe(container);
    };

    const disable = () => {
      if (!active) return;
      active = false;
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
      container.style.paddingBottom = '';
      // Devuelve las tarjetas al flujo normal (sin sticky, sin altura forzada,
      // sin transform).
      cards.forEach((card) => {
        card.style.position = '';
        card.style.height = '';
        card.style.top = '';
        card.style.transform = '';
      });
    };

    const applyBreakpoint = () => {
      if (desktopMql.matches) enable();
      else disable();
    };
    applyBreakpoint();
    desktopMql.addEventListener('change', applyBreakpoint);

    // Limpieza: evita fugas de memoria al desmontar.
    return () => {
      desktopMql.removeEventListener('change', applyBreakpoint);
      disable();
    };
  }, [topOffset, gap, scaleFactor]);

  return (
    <div ref={containerRef}>
      {Children.map(children, (child) => (
        <div
          data-stack-card
          className="overflow-hidden rounded-3xl border border-black/5 bg-paco-cream px-6 shadow-[0_-0.125rem_0.75rem_rgba(0,0,0,0.05)] mb-6 last:mb-0 md:mb-0 md:px-10"
          style={{ transformOrigin: 'center top' }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

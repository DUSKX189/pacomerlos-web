'use client';

import { useEffect } from 'react';
import { slugFromHash } from '@/lib/hashSlug';

const SETTLE_MS = 1500;

/**
 * Desplaza hasta el paquito indicado en el hash (`#<slug>`) al llegar desde la
 * home. Como la misma página renderiza dos versiones del catálogo (móvil y
 * desktop, una oculta por breakpoint) con el mismo `data-paquito-anchor`, usamos
 * un atributo de datos en vez de `id` (sin IDs duplicados) y elegimos el elemento
 * realmente visible (`offsetParent !== null`).
 *
 * Las imágenes cargan async y no reservan altura → el layout se desplaza tras el
 * primer scroll. Por eso re-alineamos el destino durante una ventana corta y lo
 * cancelamos en cuanto el usuario interactúa con el scroll.
 */
export default function DeepLinkScroller() {
  useEffect(() => {
    let raf = 0;
    let cancelled = false;

    const removeCancelListeners = () => {
      window.removeEventListener('wheel', onUserScroll);
      window.removeEventListener('touchmove', onUserScroll);
      window.removeEventListener('keydown', onUserScroll);
    };
    const onUserScroll = () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      removeCancelListeners();
    };

    const scrollToHash = () => {
      // Detén cualquier ciclo de alineación anterior.
      if (raf) cancelAnimationFrame(raf);
      removeCancelListeners();

      const slug = slugFromHash(window.location.hash);
      if (!slug) return;

      // Limpia hashes acumulados (`#a#b`) dejando solo el destino real, para que
      // no sigan creciendo en sucesivas navegaciones (replaceState no dispara
      // hashchange, así que no reentra aquí).
      if (window.location.hash !== `#${slug}`) {
        history.replaceState(
          null,
          '',
          `${window.location.pathname}${window.location.search}#${slug}`
        );
      }

      const candidates = Array.from(
        document.querySelectorAll<HTMLElement>(
          `[data-paquito-anchor="${CSS.escape(slug)}"]`
        )
      );
      const target =
        candidates.find((el) => el.offsetParent !== null) ?? candidates[0];
      if (!target) return;

      cancelled = false;
      const start = performance.now();
      window.addEventListener('wheel', onUserScroll, { passive: true });
      window.addEventListener('touchmove', onUserScroll, { passive: true });
      window.addEventListener('keydown', onUserScroll);

      const settle = () => {
        if (cancelled) return;
        target.scrollIntoView({ block: 'start' });
        if (performance.now() - start < SETTLE_MS) {
          raf = requestAnimationFrame(settle);
        } else {
          removeCancelListeners();
        }
      };
      raf = requestAnimationFrame(settle);
    };

    scrollToHash();
    window.addEventListener('hashchange', scrollToHash);
    return () => {
      window.removeEventListener('hashchange', scrollToHash);
      onUserScroll();
    };
  }, []);

  return null;
}

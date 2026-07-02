'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import PaquitoHint from './paquitoHint';
import type { Paquito } from '@/types/paquitos';
//import Reveal from '@/components/ui/Reveal';

const AUTOPLAY_MS = 8000;
const DRAG_THRESHOLD = 0.15;

type SlideState = 'active' | 'prev' | 'next' | 'far-prev' | 'far-next' | 'hidden';

function stateOf(i: number, current: number, count: number): SlideState {
  if (count <= 1) return 'active';
  const d = ((i - current) % count + count) % count;
  if (d === 0) return 'active';
  if (d === 1) return 'next';
  if (d === count - 1) return 'prev';
  if (count >= 5 && d === 2) return 'far-next';
  if (count >= 5 && d === count - 2) return 'far-prev';
  return 'hidden';
}

interface PaquitosCarouselProps {
  paquitos: Paquito[];
}

export default function PaquitosCarousel({ paquitos }: PaquitosCarouselProps) {
  const count = paquitos.length;
  const loop = count > 1;

  const [current, setCurrent] = useState(0);
  const dragWidthRef = useRef(0);
  const dragDeltaRef = useRef(0);
  const pausedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Tras un arrastre, suprime el click del <Link> de la slide activa para no
  // navegar al hacer swipe.
  const suppressClickRef = useRef(false);

  const advance = useCallback(() => {
    if (count === 0) return;
    setCurrent(i => (i + 1) % count);
  }, [count]);

  const retreat = useCallback(() => {
    if (count === 0) return;
    setCurrent(i => (i - 1 + count) % count);
  }, [count]);

  const startAutoplay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!loop) return;
    timerRef.current = setInterval(() => {
      if (!pausedRef.current) advance();
    }, AUTOPLAY_MS);
  }, [loop, advance]);

  useEffect(() => {
    startAutoplay();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startAutoplay]);

  // Arrastre sin setPointerCapture: la captura de puntero redirige el evento
  // `click` al stage (comportamiento de Chromium), lo que impedía navegar con el
  // <Link> de la slide. En su lugar seguimos el gesto con listeners en window.
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!loop) return;
    const startX = e.clientX;
    dragWidthRef.current = e.currentTarget.offsetWidth || 1;
    dragDeltaRef.current = 0;
    pausedRef.current = true;

    const onMove = (ev: PointerEvent) => {
      dragDeltaRef.current = ev.clientX - startX;
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      suppressClickRef.current = Math.abs(dragDeltaRef.current) > 8;
      const ratio = dragDeltaRef.current / (dragWidthRef.current || 1);
      if (ratio < -DRAG_THRESHOLD) advance();
      else if (ratio > DRAG_THRESHOLD) retreat();
      dragDeltaRef.current = 0;
      pausedRef.current = false;
      startAutoplay();
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  };

  if (count === 0) return null;

  const currentPaquito = paquitos[current];

  return (
    <div className="w-full">
      <div
        className="paquito-stage"
        aria-roledescription="carrusel"
        onPointerDown={onPointerDown}
        onClickCapture={(e) => {
          if (suppressClickRef.current) {
            e.preventDefault();
            suppressClickRef.current = false;
          }
        }}
        onMouseEnter={() => { pausedRef.current = true; }}
        onMouseLeave={() => { pausedRef.current = false; }}
      >
        {paquitos.map((paquito, i) => (
          <div
            key={paquito.id}
            className="paquito-slide"
            data-state={stateOf(i, current, count)}
            aria-roledescription="slide"
            aria-hidden={i !== current}
            aria-label={`${i + 1} de ${count}`}
          >
            <PaquitoHint paquito={paquito} />
          </div>
        ))}

      </div>
      <p
        key={currentPaquito.id}
        className="mt-6 font-chunko text-2xl uppercase tracking-widest text-center text-paco-orange md:text-3xl"
        style={currentPaquito.primary_color ? { color: currentPaquito.primary_color } : undefined}
      >
        {currentPaquito.name}
      </p>
    </div>
  );
}

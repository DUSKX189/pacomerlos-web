'use client';
import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';

const AUTOPLAY_MS = 8000;
const DRAG_THRESHOLD = 0.15;
const TRANSITION_MS = 700;

interface HeroCarouselProps {
  children: ReactNode;
}

export default function HeroCarousel({ children }: HeroCarouselProps) {
  const slides = Children.toArray(children);
  const count = slides.length;
  const loop = count > 1;
  const displayed = loop
    ? [slides[count - 1], ...slides, slides[0]]
    : slides;
  const firstReal = loop ? 1 : 0;
  const lastReal = loop ? count : Math.max(count - 1, 0);
  const cloneStart = 0;
  const cloneEnd = loop ? count + 1 : -1;

  const [index, setIndex] = useState(firstReal);
  const [withTransition, setWithTransition] = useState(true);
  const [dragDelta, setDragDelta] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const pointerStartX = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const indexRef = useRef(firstReal);
  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const advance = useCallback(() => {
    // Si el usuario insiste tras llegar al clon final antes de que el snap
    // automático (700ms) se ejecute, hay que saltar nosotros mismos a la
    // posición real y avanzar desde ahí. Sin esto, el índice se sale del
    // rango de `displayed` y se ven slides en blanco.
    if (loop && indexRef.current >= cloneEnd) {
      setWithTransition(false);
      setIndex(firstReal);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setWithTransition(true);
          setIndex(firstReal + 1);
        });
      });
      return;
    }
    setWithTransition(true);
    setIndex(i => i + 1);
  }, [loop, cloneEnd, firstReal]);

  const retreat = useCallback(() => {
    if (loop && indexRef.current <= cloneStart) {
      setWithTransition(false);
      setIndex(lastReal);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setWithTransition(true);
          setIndex(lastReal - 1);
        });
      });
      return;
    }
    setWithTransition(true);
    setIndex(i => i - 1);
  }, [loop, cloneStart, lastReal]);

  useEffect(() => {
    if (!loop || isDragging) return;
    if (index !== cloneEnd && index !== cloneStart) return;
    const target = index === cloneEnd ? firstReal : lastReal;
    const snapTimer = setTimeout(() => {
      setWithTransition(false);
      setIndex(target);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setWithTransition(true));
      });
    }, TRANSITION_MS);
    return () => clearTimeout(snapTimer);
  }, [index, isDragging, loop, cloneEnd, cloneStart, firstReal, lastReal]);

  const startAutoplay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!loop) return;
    timerRef.current = setInterval(advance, AUTOPLAY_MS);
  }, [loop, advance]);

  useEffect(() => {
    startAutoplay();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startAutoplay]);

  const goTo = useCallback(
    (i: number) => {
      if (count === 0) return;
      const target = ((i % count) + count) % count;
      setWithTransition(true);
      setIndex(target + firstReal);
      startAutoplay();
    },
    [count, firstReal, startAutoplay],
  );

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!loop) return;
    pointerStartX.current = e.clientX;
    setIsDragging(true);
    setDragDelta(0);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging || pointerStartX.current === null) return;
    setDragDelta(e.clientX - pointerStartX.current);
  };

  const onPointerEnd = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const width = e.currentTarget.offsetWidth || 1;
    const ratio = dragDelta / width;
    if (ratio < -DRAG_THRESHOLD) advance();
    else if (ratio > DRAG_THRESHOLD) retreat();
    else startAutoplay();
    setIsDragging(false);
    setDragDelta(0);
    pointerStartX.current = null;
  };

  const transform = `translateX(${-index * 100}%) translateX(${isDragging ? dragDelta : 0}px)`;
  const activeDot = loop ? (((index - firstReal) % count) + count) % count : index;

  return (
    <section
      className="relative h-[80vh] w-full overflow-hidden touch-pan-y select-none"
      aria-roledescription="carrusel"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
    >
      <div
        className={`flex h-full w-full ${
          isDragging || !withTransition
            ? ''
            : 'transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)]'
        }`}
        style={{ transform }}
      >
        {displayed.map((slide, i) => {
          const realIndex = loop ? (((i - firstReal) % count) + count) % count : i;
          return (
            <div
              key={i}
              className="h-full w-full shrink-0"
              aria-roledescription="slide"
              aria-label={`${realIndex + 1} de ${count}`}
              aria-hidden={i !== index}
            >
              {slide}
            </div>
          );
        })}
      </div>

      {count > 1 && (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ir al banner ${i + 1}`}
              aria-current={i === activeDot}
              className={`hero-dot ${i === activeDot ? 'hero-dot-active' : ''}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

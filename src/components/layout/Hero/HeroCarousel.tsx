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

interface HeroCarouselProps {
  children: ReactNode;
}

export default function HeroCarousel({ children }: HeroCarouselProps) {
  const slides = Children.toArray(children);
  const count = slides.length;

  const [index, setIndex] = useState(0);
  const [dragDelta, setDragDelta] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const pointerStartX = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoplay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (count <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex(prev => (prev + 1) % count);
    }, AUTOPLAY_MS);
  }, [count]);

  useEffect(() => {
    startAutoplay();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startAutoplay]);

  const goTo = useCallback(
    (i: number) => {
      if (count === 0) return;
      setIndex(((i % count) + count) % count);
      startAutoplay();
    },
    [count, startAutoplay],
  );

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (count <= 1) return;
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
    if (ratio < -DRAG_THRESHOLD) goTo(index + 1);
    else if (ratio > DRAG_THRESHOLD) goTo(index - 1);
    else startAutoplay();
    setIsDragging(false);
    setDragDelta(0);
    pointerStartX.current = null;
  };

  const transform = `translateX(${-index * 100}%) translateX(${isDragging ? dragDelta : 0}px)`;

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
        className={`flex h-full w-full ${isDragging ? '' : 'transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)]'
          }`}
        style={{ transform }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className="h-full w-full shrink-0"
            aria-roledescription="slide"
            aria-label={`${i + 1} de ${count}`}
            aria-hidden={i !== index}
          >
            {slide}
          </div>
        ))}
      </div>

      {count > 1 && (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ir al banner ${i + 1}`}
              aria-current={i === index}
              className={`hero-dot ${i === index ? 'hero-dot-active' : ''}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

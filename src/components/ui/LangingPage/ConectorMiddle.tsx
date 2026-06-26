interface ConectorMiddleProps {
  topText: string;
  bottomText: string;
  bgColor: string;
}

export default function ConectorMiddle({ topText, bottomText, bgColor }: ConectorMiddleProps) {
  return (
    <div className="relative z-30 text-paco-cream" style={{ backgroundColor: bgColor }}>
      {/* Ola superior: el color del conector sangra hacia arriba; los valles
          transparentes dejan ver la sección previa. */}
      <svg
        className="pointer-events-none absolute inset-x-0 w-full"
        style={{ top: '-46px', height: '47px' }}
        viewBox="0 0 1200 48"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path fill={bgColor} d="M0,48 H1200 V30 C1010,2 840,42 600,20 C400,2 190,38 0,16 Z" />
      </svg>

      <div className="relative z-10 flex flex-col items-center justify-center gap-5 px-8 py-8 text-center tracking-widest pb-25">
        <p className="text-xl md:text-2xl font-now uppercase">
          {topText}
        </p>
        <h3 className="padding-responsive max-w-225 text-3xl md:text-6xl font-now font-bold uppercase">
          {bottomText}
        </h3>
      </div>

      {/* Ola inferior: el color del conector sangra hacia abajo; los valles
          transparentes dejan ver la sección siguiente (sin depender de su color). */}
      <svg
        className="pointer-events-none absolute inset-x-0 w-full"
        style={{ bottom: '-46px', height: '47px' }}
        viewBox="0 0 1200 48"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path fill={bgColor} d="M0,0 H1200 V18 C1010,46 840,6 600,28 C400,46 190,10 0,32 Z" />
      </svg>
    </div>
  );
}

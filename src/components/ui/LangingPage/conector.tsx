export default function Conector() {
  return (
    <div className="relative bg-paco-purple text-paco-cream">
      {/* Conector se sobrepone al carrusel (-mt + z-20). El CreamDrip queda
          en el límite superior del conector, dentro de la zona de solape, así
          la onda actúa como transición entre carrusel y púrpura sin franja. */}
      {/* <CreamDrip className="bg-transparent top-0 h-16 md:h-24" /> */}

      <div className="relative z-10 flex flex-col items-center justify-center gap-5 px-8 py-15 text-center md:py-32">
        <h1 className="text-3xl md:text-6xl font-now font-bold uppercase">
          Prepárate Pa&apos; Comerlos
        </h1>
        <h2 className="text-xl md:text-2xl font-now font-semibold">
          Olvídate de los bollos industriales. Un paquito es otra cosa
        </h2>
      </div>

      {/* <CreamDrip className="bg-transparent bottom-0 h-12 rotate-180 md:h-20" /> */}
    </div>
  );
}

function CreamDrip({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`pointer-events-none bg-transparent absolute inset-x-0 w-full ${className}`}
    >
      <path
        fill="currentColor"
        d="M0,0 H1440 V32
           C1380,60 1320,22 1260,52
           C1200,76 1140,28 1080,54
           C1020,72 960,34 900,56
           C840,76 780,28 720,52
           C660,72 600,30 540,54
           C480,76 420,30 360,56
           C300,72 240,26 180,50
           C120,70 60,28 0,46 Z"
      />
    </svg>
  );
}

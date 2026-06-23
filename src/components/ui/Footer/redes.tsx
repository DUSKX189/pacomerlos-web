import IconRow from "./iconRow";

export default function redesContainer() {
  return (
    <div className="flex flex-col items-center gap-4 justify-center lg:col-start-2 lg:row-start-1 lg:justify-self-center">
      <p className="text-xl text-paco-cream tracking-widest font-now font-semibold uppercase">Síguenos en nuestras redes</p>
      <IconRow />
    </div>
  );
}
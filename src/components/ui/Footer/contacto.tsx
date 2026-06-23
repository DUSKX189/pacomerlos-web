import IconData from './iconData';

export default function Contacto() {
  return (
    <div className="flex justify-between lg:flex-col lg:gap-10 items-start nav-row">
      {/* Bloque 1: ubicación */}
      <div className="flex flex-col gap-3">
        <IconData icon="poste.svg">Pacomerlos Repostería S.A.</IconData>
        <IconData icon="casa.svg">28006 Madrid, España</IconData>
      </div>

      {/* Bloque 2: contacto */}
      <div className="flex flex-col gap-3">
        <IconData icon="telefono.svg">+34 600 000 000</IconData>
        <IconData icon="carta.svg">info@pacomerlos.com</IconData>
      </div>
    </div>
  );
}

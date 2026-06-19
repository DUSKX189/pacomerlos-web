/**
 * Extrae el slug efectivo de un hash de URL, tolerando hashes malformados con
 * varios `#` (p. ej. el App Router de Next a veces concatena hashes al
 * re-navegar a la misma ruta: `#nocciola-latte#pinky`). Se queda con el ÚLTIMO
 * segmento no vacío, que es el destino real.
 *
 *   "#pinky"               → "pinky"
 *   "#nocciola-latte#pinky" → "pinky"
 *   ""                     → ""
 */
export function slugFromHash(hash: string): string {
  const segments = hash.split('#').filter(Boolean);
  return segments.length
    ? decodeURIComponent(segments[segments.length - 1])
    : '';
}

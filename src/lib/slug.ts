/**
 * Convierte un texto en un slug apto para URL/ancla:
 *  - sin acentos ni diacríticos (NFD + strip),  "Paco Merlós" → "paco-merlos"
 *  - en minúsculas,
 *  - cualquier carácter no alfanumérico se vuelve guion,
 *  - sin guiones duplicados ni en los extremos.
 *
 * Se usa como identificador de paquito en el frontend (deep-linking a /sabores).
 */
export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // diacríticos combinados
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

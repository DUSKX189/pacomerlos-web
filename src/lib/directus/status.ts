export type ContentEnv = 'development' | 'production';

export function contentEnv(): ContentEnv {
  return process.env.NEXT_PUBLIC_CONTENT_ENV === 'development'
    ? 'development'
    : 'production';
}

export function statusFilter(): Record<string, string> {
  return contentEnv() === 'development'
    ? { 'filter[status][_in]': 'draft,published' }
    : { 'filter[status][_eq]': 'published' };
}

/**
 * Filtro de targeting por entorno (campo `target` enum: dev | prod | both).
 * Ortogonal a `status`: decide en qué entorno se MUESTRA el registro.
 *  - development → target ∈ (dev, both)
 *  - production  → target ∈ (prod, both)
 *
 * Nota: en una misma query de Directus, varios `filter[campo]` distintos se
 * combinan con AND, por lo que se puede fusionar con `statusFilter()`.
 *
 * ⚠️ Requiere que el campo `target` exista en la colección de Directus. Crearlo
 * (con default y backfill) ANTES de desplegar este filtro, o el fetch devolverá [].
 */
export function targetFilter(): Record<string, string> {
  return contentEnv() === 'development'
    ? { 'filter[target][_in]': 'dev,both' }
    : { 'filter[target][_in]': 'prod,both' };
}

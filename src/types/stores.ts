/**
 * Punto de venta del localizador "Encuéntralos".
 *
 * El componente es **agnóstico a la fuente de datos**: estos objetos pueden venir
 * de una colección de Directus (fuente de verdad recomendada) o de cualquier otro
 * origen. Ver `docs/encuentralos-store-locator.md` para la decisión pendiente sobre
 * el origen definitivo (Directus curado vs. seeding desde OSM).
 */
export interface Store {
  id: string | number;
  /** Nombre del punto (p. ej. "Mercadona Gran Vía"). */
  name: string;
  /** Slug de la cadena para el filtro: `mercadona`, `carrefour`, … */
  chain: ChainId;
  /** Dirección legible. */
  address: string;
  lat: number;
  lng: number;
}

/** Identificador (slug) de cada cadena de supermercados soportada. */
export type ChainId = 'mercadona' | 'carrefour' | 'dia' | 'alcampo' | 'eroski';

/** Metadatos de presentación de cada cadena (etiqueta y color de marca). */
export interface ChainMeta {
  id: ChainId;
  /** Etiqueta visible en el chip de filtro y la lista. */
  label: string;
  /** Color de marca para el marcador del mapa. */
  color: string;
}

/**
 * Registro de cadenas conocidas. Añadir aquí una nueva cadena la habilita en el
 * filtro automáticamente (los chips se derivan de las cadenas presentes en los
 * datos cruzadas con este registro).
 */
export const CHAINS: Record<ChainId, ChainMeta> = {
  mercadona: { id: 'mercadona', label: 'Mercadona', color: '#0F8140' },
  carrefour: { id: 'carrefour', label: 'Carrefour', color: '#0050AA' },
  dia: { id: 'dia', label: 'Dia', color: '#E2001A' },
  alcampo: { id: 'alcampo', label: 'Alcampo', color: '#E30613' },
  eroski: { id: 'eroski', label: 'Eroski', color: '#ED1C24' },
};

/** Valor del filtro: una cadena concreta o "todas". */
export type ChainFilter = ChainId | 'all';

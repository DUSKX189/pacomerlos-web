import type { Store } from '@/types/stores';

/**
 * ⚠️ DATOS PROVISIONALES (placeholder).
 *
 * Listado de ejemplo para desarrollar y previsualizar el localizador mientras se
 * decide el origen de datos definitivo (ver `docs/encuentralos-store-locator.md`).
 * NO son puntos de venta reales del producto: son supermercados de Madrid usados
 * solo para maquetar. Sustituir por `getPuntosVenta()` (Directus) cuando se cierren
 * las decisiones de §5 del documento.
 */
export const MOCK_STORES: Store[] = [
  { id: 1, name: 'Mercadona Gran Vía', chain: 'mercadona', address: 'Gran Vía 48, Madrid', lat: 40.4203, lng: -3.7058 },
  { id: 2, name: 'Mercadona Goya', chain: 'mercadona', address: 'C. de Goya 76, Madrid', lat: 40.4254, lng: -3.6766 },
  { id: 3, name: 'Mercadona Chamberí', chain: 'mercadona', address: 'C. de Bravo Murillo 1, Madrid', lat: 40.4361, lng: -3.7029 },
  { id: 4, name: 'Mercadona Atocha', chain: 'mercadona', address: 'Av. Ciudad de Barcelona 28, Madrid', lat: 40.4072, lng: -3.6862 },
  { id: 5, name: 'Carrefour Market Sol', chain: 'carrefour', address: 'C. de Preciados 36, Madrid', lat: 40.4189, lng: -3.7047 },
  { id: 6, name: 'Carrefour Express Malasaña', chain: 'carrefour', address: 'C. de Fuencarral 80, Madrid', lat: 40.4257, lng: -3.7012 },
  { id: 7, name: 'Carrefour Princesa', chain: 'carrefour', address: 'C. de la Princesa 47, Madrid', lat: 40.4308, lng: -3.7146 },
  { id: 8, name: 'Carrefour Retiro', chain: 'carrefour', address: 'C. de Narváez 20, Madrid', lat: 40.4196, lng: -3.6797 },
  { id: 9, name: 'Dia Lavapiés', chain: 'dia', address: 'C. de Argumosa 12, Madrid', lat: 40.4083, lng: -3.7008 },
  { id: 10, name: 'Dia Tetuán', chain: 'dia', address: 'C. de Bravo Murillo 230, Madrid', lat: 40.4602, lng: -3.6986 },
];

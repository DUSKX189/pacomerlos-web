const BASE = process.env.NEXT_PUBLIC_DIRECTUS_URL;

export interface AssetParams {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpg' | 'png' | 'avif';
}

export function assetUrl(uuid: string, params: AssetParams = {}): string {
  if (!BASE) {
    throw new Error('NEXT_PUBLIC_DIRECTUS_URL no está definida');
  }
  const qs = new URLSearchParams();
  if (params.width !== undefined) qs.set('width', String(params.width));
  if (params.height !== undefined) qs.set('height', String(params.height));
  if (params.quality !== undefined) qs.set('quality', String(params.quality));
  if (params.format) qs.set('format', params.format);
  const tail = qs.toString();
  const base = BASE.replace(/\/$/, '');
  return `${base}/assets/${uuid}${tail ? `?${tail}` : ''}`;
}

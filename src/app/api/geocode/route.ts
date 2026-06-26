import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * Proxy server-side de geocoding (Nominatim / OpenStreetMap) para la búsqueda por
 * dirección del localizador. El cliente NUNCA habla directo con Nominatim:
 *
 * - Su política de uso exige un `User-Agent`/`Referer` identificable y limita el
 *   uso intensivo; desde el servidor lo cumplimos y centralizamos.
 * - Permite cachear en el edge/servidor (`revalidate`) para no repetir consultas.
 *
 * Ver `docs/encuentralos-store-locator.md` (§3.2, §6).
 */

// Cachea cada dirección 1 día (las coordenadas de una dirección no cambian).
export const revalidate = 86400;

const NOMINATIM = 'https://nominatim.openstreetmap.org/search';
const CONTACT = 'https://pacomerlos.com';

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get('q')?.trim();
  if (!q) {
    return NextResponse.json({ error: 'missing_query' }, { status: 400 });
  }

  const url = `${NOMINATIM}?format=json&limit=1&countrycodes=es&q=${encodeURIComponent(q)}`;

  try {
    const res = await fetch(url, {
      headers: {
        // Nominatim exige identificar la aplicación.
        'User-Agent': `PacoMerlosWeb/1.0 (${CONTACT})`,
        'Accept-Language': 'es',
        Referer: CONTACT,
      },
      next: { revalidate },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'geocode_failed' }, { status: 502 });
    }

    const data: Array<{ lat: string; lon: string; display_name: string }> = await res.json();
    if (!data.length) {
      return NextResponse.json({ result: null });
    }

    const { lat, lon, display_name } = data[0];
    return NextResponse.json({
      result: { lat: Number(lat), lng: Number(lon), label: display_name },
    });
  } catch {
    return NextResponse.json({ error: 'geocode_error' }, { status: 502 });
  }
}

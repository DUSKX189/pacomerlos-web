import { NextResponse } from 'next/server';
import { subscribeToLaunchList } from '@/lib/listmonk/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Rate-limit best-effort en memoria (suficiente para dev / instancia única;
// en producción serverless habría que usar un store compartido).
const WINDOW_MS = 60_000;
const MAX_HITS = 5;
const hits = new Map<string, { count: number; ts: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now - entry.ts > WINDOW_MS) {
    hits.set(ip, { count: 1, ts: now });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_HITS;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Demasiados intentos, prueba en un minuto.' },
      { status: 429 },
    );
  }

  let body: { email?: string; website?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Petición inválida.' }, { status: 400 });
  }

  // Honeypot: el campo oculto `website` debe llegar vacío. Si trae algo, es un bot:
  // respondemos OK sin hacer nada (no le damos pistas).
  if (body.website) {
    return NextResponse.json({ ok: true, alreadySubscribed: false });
  }

  const email = (body.email ?? '').trim().toLowerCase();
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Email no válido.' }, { status: 400 });
  }

  try {
    const result = await subscribeToLaunchList(email);
    return NextResponse.json({
      ok: true,
      alreadySubscribed: result.alreadySubscribed,
    });
  } catch (err) {
    console.error('[api/notify]', err);
    return NextResponse.json(
      { error: 'No se pudo completar la suscripción.' },
      { status: 502 },
    );
  }
}

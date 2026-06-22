'use client';

import { useState } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function NotifyForm() {
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState(''); // honeypot anti-bots
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website }),
      });
      const text = await res.text();
      let data: { error?: string; alreadySubscribed?: boolean };
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          `Respuesta inesperada (${res.status}). ¿Está arrancado "pnpm dev" y la ruta /api/notify?`,
        );
      }
      if (!res.ok) throw new Error(data.error ?? 'No se pudo completar.');
      setStatus('success');
      setMessage(
        data.alreadySubscribed
          ? 'Ya estabas en la lista 😊'
          : '¡Listo! Te avisaremos del lanzamiento.',
      );
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Algo salió mal.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm">
      <label
        htmlFor="notify-email"
        className="mb-2 block text-sm font-semibold text-paco-purple"
      >
        Avísame cuando esté listo
      </label>

      <div className="flex gap-2">
        <input
          id="notify-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          disabled={status === 'loading'}
          className="min-w-0 flex-1 rounded-lg border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-paco-purple"
        />

        {/* Honeypot: oculto para humanos, los bots lo rellenan */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="hidden"
        />

        <button
          type="submit"
          disabled={status === 'loading'}
          className="shrink-0 rounded-lg bg-paco-purple px-4 py-2 text-sm font-semibold text-paco-cream transition hover:bg-paco-purple-dark disabled:opacity-60"
        >
          {status === 'loading' ? 'Enviando…' : 'Avísame'}
        </button>
      </div>

      {message && (
        <p
          className={`mt-2 text-sm ${
            status === 'error' ? 'text-paco-orange' : 'text-black/60'
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}

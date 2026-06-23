'use client';

import { useState } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function EmailForm() {
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
    // campo de email y botón de enviar
    <form onSubmit={handleSubmit}>
      <label htmlFor="notify-email" className="mb-2 block text-sm font-semibold text-paco-purple">
        Introduce tu correo electrónico
      </label>
      <input
        type="email"
        placeholder="Tu email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Tu website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        style={{ display: 'none' }}
      />
      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  );
}
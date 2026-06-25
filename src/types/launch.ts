/**
 * Estado de lanzamiento del sitio, leído del singleton `site_settings` de Directus.
 *
 * - coming_soon: pre-lanzamiento. El formulario invita a "ser el primero" y, al
 *   alta, suscribe a la lista que recibirá la campaña de Lanzamiento.
 * - launched: ya lanzado. El formulario pasa a copy de newsletter informativa.
 *
 * El flip coming_soon -> launched es la ÚNICA fuente de verdad del lanzamiento:
 * dispara el Directus Flow (envía la campaña) y cambia el copy del frontend (ISR).
 */
export type LaunchStatus = 'coming_soon' | 'launched';

export interface LaunchSettings {
  launch_status: LaunchStatus;
  /** El Flow lo pone a true tras enviar la campaña (evita reenvíos). */
  campaign_sent: boolean;
}

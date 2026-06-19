/**
 * Determina si un enlace de navegación corresponde a la ruta actual.
 * - '/' (Inicio) solo está activo en coincidencia exacta.
 * - El resto, activo en coincidencia exacta o como prefijo de ruta anidada.
 */
export function isActiveLink(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

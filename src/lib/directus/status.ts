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

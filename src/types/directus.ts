export type Status = 'draft' | 'published';

export interface DirectusResponse<T> {
  data: T;
}

export interface DirectusBase {
  id: number;
  status?: Status;
  sort?: number | null;
}

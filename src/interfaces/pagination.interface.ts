export interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  currentPage: number;
  hasMore: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export type FetchParams = Record<string, string | number | boolean>;

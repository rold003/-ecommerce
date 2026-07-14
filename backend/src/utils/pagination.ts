export interface PaginationResult {
  page: number;
  limit: number;
  skip: number;
}

export function parsePagination(input: { page?: number; limit?: number }): PaginationResult {
  const page = Math.max(1, input.page ?? 1);
  const limit = Math.min(100, Math.max(1, input.limit ?? 12));
  return { page, limit, skip: (page - 1) * limit };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function buildMeta(total: number, page: number, limit: number): PaginationMeta {
  return { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) };
}

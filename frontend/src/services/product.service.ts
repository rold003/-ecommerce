import type { PaginationMeta, Producto, ProductoSugerencia } from '@/types/product';
import { api } from './api';

export interface ProductFilters {
  categoria?: string;
  marca?: string;
  precioMin?: number;
  precioMax?: number;
  valoracionMin?: number;
  disponible?: boolean;
  destacado?: boolean;
  q?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

interface ListResponse<T> {
  status: string;
  data: T[];
  meta: PaginationMeta;
}

export const productService = {
  async list(filters: ProductFilters): Promise<{ items: Producto[]; meta: PaginationMeta }> {
    const { data } = await api.get<ListResponse<Producto>>('/products', { params: filters });
    return { items: data.data, meta: data.meta };
  },

  async getBySlug(slug: string): Promise<Producto> {
    const { data } = await api.get<{ status: string; data: { producto: Producto } }>(`/products/${slug}`);
    return data.data.producto;
  },

  async autocomplete(q: string): Promise<ProductoSugerencia[]> {
    const { data } = await api.get<{ status: string; data: { productos: ProductoSugerencia[] } }>(
      '/products/search/autocomplete',
      { params: { q } },
    );
    return data.data.productos;
  },
};

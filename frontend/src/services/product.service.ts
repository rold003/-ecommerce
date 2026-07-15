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

export interface ProductImageInput {
  url: string;
  publicId?: string;
  altText?: string;
  orden?: number;
  esPrincipal?: boolean;
}

export interface ProductInput {
  nombre: string;
  descripcion: string;
  precio: number;
  precioAnterior?: number;
  stock: number;
  sku: string;
  peso?: number;
  color?: string;
  talla?: string;
  categoriaId: string;
  marcaId: string;
  destacado?: boolean;
  estado?: 'ACTIVO' | 'INACTIVO';
  imagenes?: ProductImageInput[];
}

export const productService = {
  async list(filters: ProductFilters): Promise<{ items: Producto[]; meta: PaginationMeta }> {
    const { data } = await api.get<ListResponse<Producto>>('/products', { params: filters });
    return { items: data.data, meta: data.meta };
  },

  async listAdmin(filters: ProductFilters): Promise<{ items: Producto[]; meta: PaginationMeta }> {
    const { data } = await api.get<ListResponse<Producto>>('/products/admin', { params: filters });
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

  async create(input: ProductInput): Promise<Producto> {
    const { data } = await api.post<{ status: string; data: { producto: Producto } }>('/products', input);
    return data.data.producto;
  },

  async update(id: string, input: Partial<ProductInput>): Promise<Producto> {
    const { data } = await api.put<{ status: string; data: { producto: Producto } }>(`/products/${id}`, input);
    return data.data.producto;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  async deleteImage(productId: string, imageId: string): Promise<void> {
    await api.delete(`/products/${productId}/images/${imageId}`);
  },

  async uploadImage(file: File): Promise<{ url: string; publicId: string }> {
    const formData = new FormData();
    formData.append('image', file);
    const { data } = await api.post<{ status: string; data: { url: string; publicId: string } }>(
      '/uploads/image',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return data.data;
  },
};

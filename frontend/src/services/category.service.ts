import type { Categoria } from '@/types/product';
import { api } from './api';

export interface CategoryInput {
  nombre: string;
  descripcion?: string;
  imagenUrl?: string;
  categoriaPadreId?: string;
  activa?: boolean;
}

export const categoryService = {
  async list(): Promise<Categoria[]> {
    const { data } = await api.get<{ status: string; data: { categorias: Categoria[] } }>('/categories');
    return data.data.categorias;
  },

  async create(input: CategoryInput): Promise<Categoria> {
    const { data } = await api.post<{ status: string; data: { categoria: Categoria } }>('/categories', input);
    return data.data.categoria;
  },

  async update(id: string, input: Partial<CategoryInput>): Promise<Categoria> {
    const { data } = await api.put<{ status: string; data: { categoria: Categoria } }>(
      `/categories/${id}`,
      input,
    );
    return data.data.categoria;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};

import type { Categoria } from '@/types/product';
import { api } from './api';

export const categoryService = {
  async list(): Promise<Categoria[]> {
    const { data } = await api.get<{ status: string; data: { categorias: Categoria[] } }>('/categories');
    return data.data.categorias;
  },
};

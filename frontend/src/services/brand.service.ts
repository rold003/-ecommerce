import type { Marca } from '@/types/product';
import { api } from './api';

export interface BrandInput {
  nombre: string;
  logoUrl?: string;
}

export const brandService = {
  async list(): Promise<Marca[]> {
    const { data } = await api.get<{ status: string; data: { marcas: Marca[] } }>('/brands');
    return data.data.marcas;
  },

  async create(input: BrandInput): Promise<Marca> {
    const { data } = await api.post<{ status: string; data: { marca: Marca } }>('/brands', input);
    return data.data.marca;
  },

  async update(id: string, input: Partial<BrandInput>): Promise<Marca> {
    const { data } = await api.put<{ status: string; data: { marca: Marca } }>(`/brands/${id}`, input);
    return data.data.marca;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/brands/${id}`);
  },
};

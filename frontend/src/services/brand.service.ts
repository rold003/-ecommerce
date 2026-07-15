import type { Marca } from '@/types/product';
import { api } from './api';

export const brandService = {
  async list(): Promise<Marca[]> {
    const { data } = await api.get<{ status: string; data: { marcas: Marca[] } }>('/brands');
    return data.data.marcas;
  },
};

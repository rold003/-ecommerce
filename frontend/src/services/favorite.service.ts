import type { Favorito } from '@/types/favorite';
import { api } from './api';

export const favoriteService = {
  async list(): Promise<Favorito[]> {
    const { data } = await api.get<{ status: string; data: { favoritos: Favorito[] } }>('/favorites');
    return data.data.favoritos;
  },

  async add(productoId: string): Promise<Favorito> {
    const { data } = await api.post<{ status: string; data: { favorito: Favorito } }>(
      `/favorites/${productoId}`,
    );
    return data.data.favorito;
  },

  async remove(productoId: string): Promise<void> {
    await api.delete(`/favorites/${productoId}`);
  },
};

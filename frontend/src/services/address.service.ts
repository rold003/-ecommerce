import type { Direccion } from '@/types/address';
import { api } from './api';

export interface AddressInput {
  etiqueta: string;
  destinatario: string;
  telefono: string;
  calle: string;
  numero?: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
  pais?: string;
  referencia?: string;
  predeterminada?: boolean;
}

export const addressService = {
  async list(): Promise<Direccion[]> {
    const { data } = await api.get<{ status: string; data: { direcciones: Direccion[] } }>(
      '/users/me/addresses',
    );
    return data.data.direcciones;
  },

  async create(input: AddressInput): Promise<Direccion> {
    const { data } = await api.post<{ status: string; data: { direccion: Direccion } }>(
      '/users/me/addresses',
      input,
    );
    return data.data.direccion;
  },

  async update(id: string, input: Partial<AddressInput>): Promise<Direccion> {
    const { data } = await api.patch<{ status: string; data: { direccion: Direccion } }>(
      `/users/me/addresses/${id}`,
      input,
    );
    return data.data.direccion;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/users/me/addresses/${id}`);
  },
};

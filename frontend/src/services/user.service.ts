import type { Usuario } from '@/types/user';
import { api } from './api';

export interface UpdateProfileInput {
  nombre?: string;
  apellido?: string;
  telefono?: string | null;
}

export const userService = {
  async updateProfile(input: UpdateProfileInput): Promise<Usuario> {
    const { data } = await api.patch<{ status: string; data: { usuario: Usuario } }>('/users/me', input);
    return data.data.usuario;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.patch('/users/me/password', { currentPassword, newPassword });
  },
};

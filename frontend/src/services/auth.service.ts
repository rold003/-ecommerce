import type { Usuario } from '@/types/user';
import { api } from './api';

interface UsuarioResponse {
  status: string;
  data: { usuario: Usuario };
}

export interface RegisterInput {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export const authService = {
  async register(input: RegisterInput): Promise<Usuario> {
    const { data } = await api.post<UsuarioResponse>('/auth/register', input);
    return data.data.usuario;
  },

  async login(input: LoginInput): Promise<Usuario> {
    const { data } = await api.post<UsuarioResponse>('/auth/login', input);
    return data.data.usuario;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async me(): Promise<Usuario> {
    const { data } = await api.get<UsuarioResponse>('/auth/me');
    return data.data.usuario;
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await api.post('/auth/reset-password', { token, password });
  },
};

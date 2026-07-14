export type Rol = 'CLIENTE' | 'ADMIN';

export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string | null;
  avatarUrl: string | null;
  rol: Rol;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

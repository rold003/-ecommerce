import type { Usuario } from '@prisma/client';

export type UsuarioPublico = Omit<Usuario, 'passwordHash'>;

// Nunca se debe devolver passwordHash en una respuesta HTTP.
export function toPublicUser(usuario: Usuario): UsuarioPublico {
  const { passwordHash, ...publico } = usuario;
  return publico;
}

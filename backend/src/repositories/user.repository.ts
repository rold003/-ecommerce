import { Prisma } from '@prisma/client';
import { prisma } from '../database/prisma';

export const userRepository = {
  findByEmail(email: string) {
    return prisma.usuario.findUnique({ where: { email } });
  },

  findById(id: string) {
    return prisma.usuario.findUnique({ where: { id } });
  },

  createWithCart(data: Prisma.UsuarioCreateInput) {
    return prisma.usuario.create({ data: { ...data, carrito: { create: {} } } });
  },

  updatePassword(id: string, passwordHash: string) {
    return prisma.usuario.update({ where: { id }, data: { passwordHash } });
  },

  update(id: string, data: Prisma.UsuarioUpdateInput) {
    return prisma.usuario.update({ where: { id }, data });
  },
};

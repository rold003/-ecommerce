import { Prisma } from '@prisma/client';
import { prisma } from '../database/prisma';

const userSelect = {
  id: true,
  nombre: true,
  apellido: true,
  email: true,
  telefono: true,
  rol: true,
  activo: true,
  createdAt: true,
} satisfies Prisma.UsuarioSelect;

export const adminRepository = {
  async findManyUsers(where: Prisma.UsuarioWhereInput, skip: number, take: number) {
    const [items, total] = await Promise.all([
      prisma.usuario.findMany({ where, select: userSelect, orderBy: { createdAt: 'desc' }, skip, take }),
      prisma.usuario.count({ where }),
    ]);
    return { items, total };
  },

  updateUser(id: string, data: Prisma.UsuarioUpdateInput) {
    return prisma.usuario.update({ where: { id }, data, select: userSelect });
  },
};

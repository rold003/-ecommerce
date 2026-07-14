import { Prisma } from '@prisma/client';
import { prisma } from '../database/prisma';

export const addressRepository = {
  findAllForUser(usuarioId: string) {
    return prisma.direccion.findMany({
      where: { usuarioId },
      orderBy: [{ predeterminada: 'desc' }, { createdAt: 'desc' }],
    });
  },

  findByIdForUser(id: string, usuarioId: string) {
    return prisma.direccion.findFirst({ where: { id, usuarioId } });
  },

  countForUser(usuarioId: string) {
    return prisma.direccion.count({ where: { usuarioId } });
  },

  unsetDefaultForUser(tx: Prisma.TransactionClient, usuarioId: string, exceptId?: string) {
    return tx.direccion.updateMany({
      where: { usuarioId, ...(exceptId ? { id: { not: exceptId } } : {}) },
      data: { predeterminada: false },
    });
  },
};

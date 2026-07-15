import { prisma } from '../database/prisma';

export const favoriteRepository = {
  findAllForUser(usuarioId: string) {
    return prisma.favorito.findMany({
      where: { usuarioId },
      include: {
        producto: {
          include: { imagenes: { orderBy: { orden: 'asc' } }, categoria: true, marca: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  findOne(usuarioId: string, productoId: string) {
    return prisma.favorito.findUnique({ where: { usuarioId_productoId: { usuarioId, productoId } } });
  },

  create(usuarioId: string, productoId: string) {
    return prisma.favorito.create({ data: { usuarioId, productoId } });
  },

  delete(usuarioId: string, productoId: string) {
    return prisma.favorito.deleteMany({ where: { usuarioId, productoId } });
  },
};

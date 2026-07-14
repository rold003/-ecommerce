import { prisma } from '../database/prisma';

const cartInclude = {
  items: {
    include: {
      producto: {
        include: { imagenes: { orderBy: { orden: 'asc' as const }, take: 1 } },
      },
    },
    orderBy: { createdAt: 'asc' as const },
  },
  cupon: true,
};

export const cartRepository = {
  async getOrCreateForUser(usuarioId: string) {
    const existente = await prisma.carrito.findUnique({ where: { usuarioId } });
    if (existente) return existente;
    return prisma.carrito.create({ data: { usuarioId } });
  },

  findByUserWithItems(usuarioId: string) {
    return prisma.carrito.findUnique({ where: { usuarioId }, include: cartInclude });
  },

  findItem(carritoId: string, productoId: string) {
    return prisma.itemCarrito.findUnique({ where: { carritoId_productoId: { carritoId, productoId } } });
  },
};

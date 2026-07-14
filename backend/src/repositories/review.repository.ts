import { Prisma } from '@prisma/client';
import { prisma } from '../database/prisma';

export const reviewRepository = {
  findByUserAndProduct(usuarioId: string, productoId: string) {
    return prisma.resena.findUnique({ where: { usuarioId_productoId: { usuarioId, productoId } } });
  },

  findById(id: string) {
    return prisma.resena.findUnique({ where: { id } });
  },

  async findManyForProduct(productoId: string, skip: number, take: number) {
    const where: Prisma.ResenaWhereInput = { productoId, aprobada: true };
    const [items, total] = await Promise.all([
      prisma.resena.findMany({
        where,
        include: { usuario: { select: { id: true, nombre: true, apellido: true, avatarUrl: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.resena.count({ where }),
    ]);
    return { items, total };
  },

  create(data: Prisma.ResenaCreateInput) {
    return prisma.resena.create({ data });
  },

  update(id: string, data: Prisma.ResenaUpdateInput) {
    return prisma.resena.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.resena.delete({ where: { id } });
  },

  async recalcularProducto(productoId: string): Promise<void> {
    const agregado = await prisma.resena.aggregate({
      where: { productoId, aprobada: true },
      _avg: { calificacion: true },
      _count: { _all: true },
    });

    await prisma.producto.update({
      where: { id: productoId },
      data: {
        valoracionProm: agregado._avg.calificacion ?? 0,
        totalResenas: agregado._count._all,
      },
    });
  },
};

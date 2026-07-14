import { Prisma } from '@prisma/client';
import { prisma } from '../database/prisma';

export const orderInclude = {
  items: true,
  pago: true,
  direccion: true,
} satisfies Prisma.PedidoInclude;

export const orderRepository = {
  async findManyForUser(usuarioId: string, where: Prisma.PedidoWhereInput, skip: number, take: number) {
    const fullWhere = { ...where, usuarioId };
    const [items, total] = await Promise.all([
      prisma.pedido.findMany({ where: fullWhere, include: orderInclude, orderBy: { createdAt: 'desc' }, skip, take }),
      prisma.pedido.count({ where: fullWhere }),
    ]);
    return { items, total };
  },

  async findManyAdmin(where: Prisma.PedidoWhereInput, skip: number, take: number) {
    const [items, total] = await Promise.all([
      prisma.pedido.findMany({
        where,
        include: { ...orderInclude, usuario: { select: { id: true, nombre: true, apellido: true, email: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.pedido.count({ where }),
    ]);
    return { items, total };
  },

  findById(id: string) {
    return prisma.pedido.findUnique({ where: { id }, include: orderInclude });
  },
};

import { Prisma } from '@prisma/client';
import { prisma } from '../database/prisma';

export const couponRepository = {
  findAll() {
    return prisma.cupon.findMany({ orderBy: { createdAt: 'desc' } });
  },

  findById(id: string) {
    return prisma.cupon.findUnique({ where: { id } });
  },

  findByCode(codigo: string) {
    return prisma.cupon.findUnique({ where: { codigo } });
  },

  create(data: Prisma.CuponCreateInput) {
    return prisma.cupon.create({ data });
  },

  update(id: string, data: Prisma.CuponUpdateInput) {
    return prisma.cupon.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.cupon.delete({ where: { id } });
  },
};

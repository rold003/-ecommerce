import { Prisma } from '@prisma/client';
import { prisma } from '../database/prisma';

export const brandRepository = {
  findAll() {
    return prisma.marca.findMany({ orderBy: { nombre: 'asc' } });
  },

  findBySlug(slug: string) {
    return prisma.marca.findUnique({ where: { slug } });
  },

  findById(id: string) {
    return prisma.marca.findUnique({ where: { id } });
  },

  findBySlugRaw(slug: string) {
    return prisma.marca.findUnique({ where: { slug }, select: { id: true } });
  },

  countProducts(id: string) {
    return prisma.producto.count({ where: { marcaId: id } });
  },

  create(data: Prisma.MarcaCreateInput) {
    return prisma.marca.create({ data });
  },

  update(id: string, data: Prisma.MarcaUpdateInput) {
    return prisma.marca.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.marca.delete({ where: { id } });
  },
};

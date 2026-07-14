import { Prisma } from '@prisma/client';
import { prisma } from '../database/prisma';

export const categoryRepository = {
  findAll(onlyActive: boolean) {
    return prisma.categoria.findMany({
      where: { ...(onlyActive ? { activa: true } : {}), categoriaPadreId: null },
      include: { subcategorias: { where: onlyActive ? { activa: true } : undefined } },
      orderBy: { nombre: 'asc' },
    });
  },

  findBySlug(slug: string) {
    return prisma.categoria.findUnique({ where: { slug }, include: { subcategorias: true } });
  },

  findById(id: string) {
    return prisma.categoria.findUnique({ where: { id } });
  },

  findBySlugRaw(slug: string) {
    return prisma.categoria.findUnique({ where: { slug }, select: { id: true } });
  },

  countProducts(id: string) {
    return prisma.producto.count({ where: { categoriaId: id } });
  },

  create(data: Prisma.CategoriaCreateInput) {
    return prisma.categoria.create({ data });
  },

  update(id: string, data: Prisma.CategoriaUpdateInput) {
    return prisma.categoria.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.categoria.delete({ where: { id } });
  },
};

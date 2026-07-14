import { Prisma } from '@prisma/client';
import { prisma } from '../database/prisma';

export interface ProductFilters {
  categoria?: string;
  marca?: string;
  precioMin?: number;
  precioMax?: number;
  valoracionMin?: number;
  disponible?: boolean;
  destacado?: boolean;
  q?: string;
}

function buildWhere(filters: ProductFilters, onlyActive: boolean): Prisma.ProductoWhereInput {
  const where: Prisma.ProductoWhereInput = {};
  if (onlyActive) where.estado = 'ACTIVO';
  if (filters.categoria) where.categoria = { slug: filters.categoria };
  if (filters.marca) where.marca = { slug: filters.marca };

  if (filters.precioMin !== undefined || filters.precioMax !== undefined) {
    where.precio = {
      ...(filters.precioMin !== undefined ? { gte: filters.precioMin } : {}),
      ...(filters.precioMax !== undefined ? { lte: filters.precioMax } : {}),
    };
  }

  if (filters.valoracionMin !== undefined) where.valoracionProm = { gte: filters.valoracionMin };
  if (filters.disponible) where.stock = { gt: 0 };
  if (filters.destacado !== undefined) where.destacado = filters.destacado;

  if (filters.q) {
    where.OR = [
      { nombre: { contains: filters.q, mode: 'insensitive' } },
      { descripcion: { contains: filters.q, mode: 'insensitive' } },
      { sku: { contains: filters.q, mode: 'insensitive' } },
    ];
  }

  return where;
}

function buildOrderBy(sort?: string): Prisma.ProductoOrderByWithRelationInput {
  switch (sort) {
    case 'precio_asc':
      return { precio: 'asc' };
    case 'precio_desc':
      return { precio: 'desc' };
    case 'mas_vendidos':
      return { vendidos: 'desc' };
    case 'mejor_valorados':
      return { valoracionProm: 'desc' };
    case 'mas_recientes':
    default:
      return { createdAt: 'desc' };
  }
}

const includeImages = {
  imagenes: { orderBy: { orden: 'asc' as const } },
  categoria: true,
  marca: true,
} satisfies Prisma.ProductoInclude;

export const productRepository = {
  async findMany(
    filters: ProductFilters,
    sort: string | undefined,
    skip: number,
    take: number,
    onlyActive: boolean,
  ) {
    const where = buildWhere(filters, onlyActive);
    const [items, total] = await Promise.all([
      prisma.producto.findMany({ where, orderBy: buildOrderBy(sort), skip, take, include: includeImages }),
      prisma.producto.count({ where }),
    ]);
    return { items, total };
  },

  findBySlug(slug: string, onlyActive: boolean) {
    return prisma.producto.findFirst({
      where: { slug, ...(onlyActive ? { estado: 'ACTIVO' as const } : {}) },
      include: includeImages,
    });
  },

  findById(id: string) {
    return prisma.producto.findUnique({ where: { id }, include: includeImages });
  },

  findBySku(sku: string) {
    return prisma.producto.findUnique({ where: { sku } });
  },

  autocomplete(q: string, take = 8) {
    return prisma.producto.findMany({
      where: { estado: 'ACTIVO', nombre: { contains: q, mode: 'insensitive' } },
      select: {
        id: true,
        nombre: true,
        slug: true,
        precio: true,
        imagenes: { take: 1, orderBy: { orden: 'asc' }, select: { url: true } },
      },
      take,
    });
  },

  create(data: Prisma.ProductoCreateInput) {
    return prisma.producto.create({ data, include: includeImages });
  },

  softDelete(id: string) {
    return prisma.producto.update({ where: { id }, data: { estado: 'INACTIVO' } });
  },
};

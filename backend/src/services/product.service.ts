import { prisma } from '../database/prisma';
import { brandRepository } from '../repositories/brand.repository';
import { categoryRepository } from '../repositories/category.repository';
import { productRepository } from '../repositories/product.repository';
import { AppError } from '../utils/AppError';
import { deleteImageByPublicId } from '../utils/cloudinary';
import { buildMeta, parsePagination } from '../utils/pagination';
import { slugify } from '../utils/slugify';
import type { CreateProductInput, ListProductsQuery, UpdateProductInput } from '../validators/product.validator';

async function generateUniqueSlug(nombre: string, excludeId?: string): Promise<string> {
  const base = slugify(nombre) || 'producto';
  let candidate = base;
  let suffix = 2;

  while (true) {
    const existente = await prisma.producto.findUnique({ where: { slug: candidate }, select: { id: true } });
    if (!existente || existente.id === excludeId) return candidate;
    candidate = `${base}-${suffix++}`;
  }
}

const includeImages = {
  imagenes: { orderBy: { orden: 'asc' as const } },
  categoria: true,
  marca: true,
};

export const productService = {
  async list(query: ListProductsQuery, onlyActive: boolean) {
    const { page, limit, skip } = parsePagination({ page: query.page, limit: query.limit });
    const { items, total } = await productRepository.findMany(
      {
        categoria: query.categoria,
        marca: query.marca,
        precioMin: query.precioMin,
        precioMax: query.precioMax,
        valoracionMin: query.valoracionMin,
        disponible: query.disponible,
        destacado: query.destacado,
        q: query.q,
      },
      query.sort,
      skip,
      limit,
      onlyActive,
    );
    return { items, meta: buildMeta(total, page, limit) };
  },

  async getBySlug(slug: string, onlyActive: boolean) {
    const producto = await productRepository.findBySlug(slug, onlyActive);
    if (!producto) throw new AppError('Producto no encontrado', 404);
    return producto;
  },

  autocomplete(q: string) {
    return productRepository.autocomplete(q);
  },

  async create(input: CreateProductInput) {
    const [categoria, marca, skuExistente] = await Promise.all([
      categoryRepository.findById(input.categoriaId),
      brandRepository.findById(input.marcaId),
      productRepository.findBySku(input.sku),
    ]);
    if (!categoria) throw new AppError('Categoría no encontrada', 400);
    if (!marca) throw new AppError('Marca no encontrada', 400);
    if (skuExistente) throw new AppError('Ya existe un producto con ese SKU', 409);

    const slug = await generateUniqueSlug(input.nombre);
    const { imagenes, categoriaId, marcaId, ...rest } = input;

    return productRepository.create({
      ...rest,
      slug,
      categoria: { connect: { id: categoriaId } },
      marca: { connect: { id: marcaId } },
      ...(imagenes && imagenes.length > 0 ? { imagenes: { create: imagenes } } : {}),
    });
  },

  async update(id: string, input: UpdateProductInput) {
    const existente = await productRepository.findById(id);
    if (!existente) throw new AppError('Producto no encontrado', 404);

    if (input.sku && input.sku !== existente.sku) {
      const skuExistente = await productRepository.findBySku(input.sku);
      if (skuExistente) throw new AppError('Ya existe un producto con ese SKU', 409);
    }

    if (input.categoriaId) {
      const categoria = await categoryRepository.findById(input.categoriaId);
      if (!categoria) throw new AppError('Categoría no encontrada', 400);
    }
    if (input.marcaId) {
      const marca = await brandRepository.findById(input.marcaId);
      if (!marca) throw new AppError('Marca no encontrada', 400);
    }

    let slug: string | undefined;
    if (input.nombre && input.nombre !== existente.nombre) {
      slug = await generateUniqueSlug(input.nombre, id);
    }

    const { imagenes, categoriaId, marcaId, ...rest } = input;
    const imagenesAEliminar = imagenes ? await prisma.imagen.findMany({ where: { productoId: id } }) : [];

    const actualizado = await prisma.$transaction(async (tx) => {
      if (imagenes) {
        await tx.imagen.deleteMany({ where: { productoId: id } });
      }
      return tx.producto.update({
        where: { id },
        data: {
          ...rest,
          ...(slug ? { slug } : {}),
          ...(categoriaId ? { categoria: { connect: { id: categoriaId } } } : {}),
          ...(marcaId ? { marca: { connect: { id: marcaId } } } : {}),
          ...(imagenes ? { imagenes: { create: imagenes } } : {}),
        },
        include: includeImages,
      });
    });

    // Limpieza de Cloudinary fuera de la transacción (no crítica: si falla, solo queda
    // basura remota, no compromete la consistencia de la base de datos).
    for (const imagen of imagenesAEliminar) {
      if (imagen.publicId) {
        deleteImageByPublicId(imagen.publicId).catch((err: unknown) =>
          console.error('Error eliminando imagen de Cloudinary:', err),
        );
      }
    }

    return actualizado;
  },

  async softDelete(id: string): Promise<void> {
    const existente = await productRepository.findById(id);
    if (!existente) throw new AppError('Producto no encontrado', 404);
    await productRepository.softDelete(id);
  },

  async removeImage(productoId: string, imagenId: string): Promise<void> {
    const imagen = await prisma.imagen.findFirst({ where: { id: imagenId, productoId } });
    if (!imagen) throw new AppError('Imagen no encontrada', 404);

    await prisma.imagen.delete({ where: { id: imagenId } });

    if (imagen.publicId) {
      deleteImageByPublicId(imagen.publicId).catch((err: unknown) =>
        console.error('Error eliminando imagen de Cloudinary:', err),
      );
    }
  },
};

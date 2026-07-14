import { categoryRepository } from '../repositories/category.repository';
import { AppError } from '../utils/AppError';
import { slugify } from '../utils/slugify';

interface CreateCategoryInput {
  nombre: string;
  descripcion?: string;
  imagenUrl?: string;
  categoriaPadreId?: string;
}

interface UpdateCategoryInput {
  nombre?: string;
  descripcion?: string;
  imagenUrl?: string;
  activa?: boolean;
  categoriaPadreId?: string | null;
}

async function generateUniqueSlug(nombre: string, excludeId?: string): Promise<string> {
  const base = slugify(nombre) || 'categoria';
  let candidate = base;
  let suffix = 2;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existente = await categoryRepository.findBySlugRaw(candidate);
    if (!existente || existente.id === excludeId) return candidate;
    candidate = `${base}-${suffix++}`;
  }
}

export const categoryService = {
  list(onlyActive: boolean) {
    return categoryRepository.findAll(onlyActive);
  },

  async getBySlug(slug: string) {
    const categoria = await categoryRepository.findBySlug(slug);
    if (!categoria) throw new AppError('Categoría no encontrada', 404);
    return categoria;
  },

  async create(input: CreateCategoryInput) {
    const slug = await generateUniqueSlug(input.nombre);
    const { categoriaPadreId, ...rest } = input;
    return categoryRepository.create({
      ...rest,
      slug,
      ...(categoriaPadreId ? { categoriaPadre: { connect: { id: categoriaPadreId } } } : {}),
    });
  },

  async update(id: string, input: UpdateCategoryInput) {
    const existente = await categoryRepository.findById(id);
    if (!existente) throw new AppError('Categoría no encontrada', 404);

    if (input.categoriaPadreId === id) {
      throw new AppError('Una categoría no puede ser su propia subcategoría', 400);
    }

    let slug: string | undefined;
    if (input.nombre && input.nombre !== existente.nombre) {
      slug = await generateUniqueSlug(input.nombre, id);
    }

    const { categoriaPadreId, ...rest } = input;
    return categoryRepository.update(id, {
      ...rest,
      ...(slug ? { slug } : {}),
      ...(categoriaPadreId !== undefined
        ? categoriaPadreId === null
          ? { categoriaPadre: { disconnect: true } }
          : { categoriaPadre: { connect: { id: categoriaPadreId } } }
        : {}),
    });
  },

  async remove(id: string): Promise<void> {
    const existente = await categoryRepository.findById(id);
    if (!existente) throw new AppError('Categoría no encontrada', 404);

    const productos = await categoryRepository.countProducts(id);
    if (productos > 0) {
      throw new AppError('No se puede eliminar: hay productos asociados a esta categoría', 409);
    }

    await categoryRepository.delete(id);
  },
};

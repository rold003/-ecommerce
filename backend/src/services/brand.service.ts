import { brandRepository } from '../repositories/brand.repository';
import { AppError } from '../utils/AppError';
import { slugify } from '../utils/slugify';

interface BrandInput {
  nombre?: string;
  logoUrl?: string;
}

async function generateUniqueSlug(nombre: string, excludeId?: string): Promise<string> {
  const base = slugify(nombre) || 'marca';
  let candidate = base;
  let suffix = 2;

  while (true) {
    const existente = await brandRepository.findBySlugRaw(candidate);
    if (!existente || existente.id === excludeId) return candidate;
    candidate = `${base}-${suffix++}`;
  }
}

export const brandService = {
  list() {
    return brandRepository.findAll();
  },

  async getBySlug(slug: string) {
    const marca = await brandRepository.findBySlug(slug);
    if (!marca) throw new AppError('Marca no encontrada', 404);
    return marca;
  },

  async create(input: Required<Pick<BrandInput, 'nombre'>> & BrandInput) {
    const slug = await generateUniqueSlug(input.nombre);
    return brandRepository.create({ nombre: input.nombre, slug, logoUrl: input.logoUrl });
  },

  async update(id: string, input: BrandInput) {
    const existente = await brandRepository.findById(id);
    if (!existente) throw new AppError('Marca no encontrada', 404);

    let slug: string | undefined;
    if (input.nombre && input.nombre !== existente.nombre) {
      slug = await generateUniqueSlug(input.nombre, id);
    }

    return brandRepository.update(id, { ...input, ...(slug ? { slug } : {}) });
  },

  async remove(id: string): Promise<void> {
    const existente = await brandRepository.findById(id);
    if (!existente) throw new AppError('Marca no encontrada', 404);

    const productos = await brandRepository.countProducts(id);
    if (productos > 0) {
      throw new AppError('No se puede eliminar: hay productos asociados a esta marca', 409);
    }

    await brandRepository.delete(id);
  },
};

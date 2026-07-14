import { prisma } from '../database/prisma';
import { reviewRepository } from '../repositories/review.repository';
import { AppError } from '../utils/AppError';
import { buildMeta, parsePagination } from '../utils/pagination';

interface UpdateReviewInput {
  calificacion?: number;
  comentario?: string;
}

export const reviewService = {
  async list(productoId: string, page?: number, limit?: number) {
    const { page: p, limit: l, skip } = parsePagination({ page, limit });
    const { items, total } = await reviewRepository.findManyForProduct(productoId, skip, l);
    return { items, meta: buildMeta(total, p, l) };
  },

  async create(usuarioId: string, productoId: string, calificacion: number, comentario?: string) {
    const producto = await prisma.producto.findUnique({ where: { id: productoId } });
    if (!producto) throw new AppError('Producto no encontrado', 404);

    const existente = await reviewRepository.findByUserAndProduct(usuarioId, productoId);
    if (existente) {
      throw new AppError('Ya reseñaste este producto. Puedes editar tu reseña existente.', 409);
    }

    const resena = await reviewRepository.create({
      calificacion,
      comentario,
      usuario: { connect: { id: usuarioId } },
      producto: { connect: { id: productoId } },
    });
    await reviewRepository.recalcularProducto(productoId);
    return resena;
  },

  async update(id: string, usuarioId: string, data: UpdateReviewInput) {
    const resena = await reviewRepository.findById(id);
    if (!resena || resena.usuarioId !== usuarioId) throw new AppError('Reseña no encontrada', 404);

    const actualizada = await reviewRepository.update(id, data);
    await reviewRepository.recalcularProducto(resena.productoId);
    return actualizada;
  },

  async remove(id: string, usuarioId: string, esAdmin: boolean): Promise<void> {
    const resena = await reviewRepository.findById(id);
    if (!resena) throw new AppError('Reseña no encontrada', 404);
    if (!esAdmin && resena.usuarioId !== usuarioId) throw new AppError('Reseña no encontrada', 404);

    await reviewRepository.delete(id);
    await reviewRepository.recalcularProducto(resena.productoId);
  },

  async moderate(id: string, aprobada: boolean) {
    const resena = await reviewRepository.findById(id);
    if (!resena) throw new AppError('Reseña no encontrada', 404);

    const actualizada = await reviewRepository.update(id, { aprobada });
    await reviewRepository.recalcularProducto(resena.productoId);
    return actualizada;
  },
};

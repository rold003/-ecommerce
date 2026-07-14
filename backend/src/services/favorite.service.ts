import { prisma } from '../database/prisma';
import { favoriteRepository } from '../repositories/favorite.repository';
import { AppError } from '../utils/AppError';

export const favoriteService = {
  list(usuarioId: string) {
    return favoriteRepository.findAllForUser(usuarioId);
  },

  async add(usuarioId: string, productoId: string) {
    const producto = await prisma.producto.findUnique({ where: { id: productoId } });
    if (!producto) throw new AppError('Producto no encontrado', 404);

    const existente = await favoriteRepository.findOne(usuarioId, productoId);
    if (existente) throw new AppError('Ya está en tus favoritos', 409);

    return favoriteRepository.create(usuarioId, productoId);
  },

  async remove(usuarioId: string, productoId: string): Promise<void> {
    const resultado = await favoriteRepository.delete(usuarioId, productoId);
    if (resultado.count === 0) throw new AppError('No estaba en tus favoritos', 404);
  },
};

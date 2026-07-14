import { addressRepository } from '../repositories/address.repository';
import { prisma } from '../database/prisma';
import { AppError } from '../utils/AppError';

interface AddressInput {
  etiqueta: string;
  destinatario: string;
  telefono: string;
  calle: string;
  numero?: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
  pais?: string;
  referencia?: string;
  predeterminada?: boolean;
}

export const addressService = {
  list(usuarioId: string) {
    return addressRepository.findAllForUser(usuarioId);
  },

  async create(usuarioId: string, data: AddressInput) {
    const esPrimera = (await addressRepository.countForUser(usuarioId)) === 0;
    const predeterminada = Boolean(data.predeterminada) || esPrimera;

    return prisma.$transaction(async (tx) => {
      if (predeterminada) {
        await addressRepository.unsetDefaultForUser(tx, usuarioId);
      }
      return tx.direccion.create({
        data: { ...data, predeterminada, usuario: { connect: { id: usuarioId } } },
      });
    });
  },

  async update(id: string, usuarioId: string, data: Partial<AddressInput>) {
    const existente = await addressRepository.findByIdForUser(id, usuarioId);
    if (!existente) throw new AppError('Dirección no encontrada', 404);

    return prisma.$transaction(async (tx) => {
      if (data.predeterminada) {
        await addressRepository.unsetDefaultForUser(tx, usuarioId, id);
      }
      return tx.direccion.update({ where: { id }, data });
    });
  },

  async remove(id: string, usuarioId: string): Promise<void> {
    const existente = await addressRepository.findByIdForUser(id, usuarioId);
    if (!existente) throw new AppError('Dirección no encontrada', 404);
    await prisma.direccion.delete({ where: { id } });
  },
};

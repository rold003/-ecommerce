import type { TipoCupon } from '@prisma/client';
import { couponRepository } from '../repositories/coupon.repository';
import { AppError } from '../utils/AppError';

interface CouponInput {
  codigo: string;
  tipo: TipoCupon;
  valor: number;
  fechaInicio: Date;
  fechaFin: Date;
  usoMaximo?: number;
  montoMinimo?: number;
  activo?: boolean;
}

export const couponService = {
  list() {
    return couponRepository.findAll();
  },

  async create(input: CouponInput) {
    const existente = await couponRepository.findByCode(input.codigo);
    if (existente) throw new AppError('Ya existe un cupón con ese código', 409);
    return couponRepository.create(input);
  },

  async update(id: string, input: Partial<CouponInput>) {
    const existente = await couponRepository.findById(id);
    if (!existente) throw new AppError('Cupón no encontrado', 404);

    if (input.codigo && input.codigo !== existente.codigo) {
      const codigoExistente = await couponRepository.findByCode(input.codigo);
      if (codigoExistente) throw new AppError('Ya existe un cupón con ese código', 409);
    }

    return couponRepository.update(id, input);
  },

  async remove(id: string): Promise<void> {
    const existente = await couponRepository.findById(id);
    if (!existente) throw new AppError('Cupón no encontrado', 404);
    await couponRepository.delete(id);
  },
};

import type { Cupon } from '@/types/coupon';
import { api } from './api';

export interface CouponInput {
  codigo: string;
  tipo: 'PORCENTAJE' | 'MONTO_FIJO';
  valor: number;
  fechaInicio: string;
  fechaFin: string;
  usoMaximo?: number;
  montoMinimo?: number;
  activo?: boolean;
}

export const couponService = {
  async list(): Promise<Cupon[]> {
    const { data } = await api.get<{ status: string; data: { cupones: Cupon[] } }>('/coupons');
    return data.data.cupones;
  },

  async create(input: CouponInput): Promise<Cupon> {
    const { data } = await api.post<{ status: string; data: { cupon: Cupon } }>('/coupons', input);
    return data.data.cupon;
  },

  async update(id: string, input: Partial<CouponInput>): Promise<Cupon> {
    const { data } = await api.put<{ status: string; data: { cupon: Cupon } }>(`/coupons/${id}`, input);
    return data.data.cupon;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/coupons/${id}`);
  },
};

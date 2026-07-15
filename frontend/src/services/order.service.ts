import type { PaginationMeta } from '@/types/product';
import type { Pedido } from '@/types/order';
import { api } from './api';

export interface CheckoutInput {
  direccionId: string;
  metodoPago: string;
  notas?: string;
}

export const orderService = {
  async checkout(input: CheckoutInput): Promise<Pedido> {
    const { data } = await api.post<{ status: string; data: { pedido: Pedido } }>('/orders/checkout', input);
    return data.data.pedido;
  },

  async getById(id: string): Promise<Pedido> {
    const { data } = await api.get<{ status: string; data: { pedido: Pedido } }>(`/orders/${id}`);
    return data.data.pedido;
  },

  async listMine(params?: { estado?: string; page?: number; limit?: number }): Promise<{
    items: Pedido[];
    meta: PaginationMeta;
  }> {
    const { data } = await api.get<{ status: string; data: Pedido[]; meta: PaginationMeta }>('/orders', {
      params,
    });
    return { items: data.data, meta: data.meta };
  },

  async cancel(id: string): Promise<Pedido> {
    const { data } = await api.post<{ status: string; data: { pedido: Pedido } }>(`/orders/${id}/cancel`);
    return data.data.pedido;
  },
};

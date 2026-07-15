import type { PaginationMeta } from '@/types/product';
import type { Pedido, PedidoAdmin } from '@/types/order';
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

  async listAdmin(params?: { estado?: string; page?: number; limit?: number }): Promise<{
    items: PedidoAdmin[];
    meta: PaginationMeta;
  }> {
    const { data } = await api.get<{ status: string; data: PedidoAdmin[]; meta: PaginationMeta }>(
      '/orders/admin',
      { params },
    );
    return { items: data.data, meta: data.meta };
  },

  async updateStatus(id: string, input: { estado: string; numeroSeguimiento?: string }): Promise<Pedido> {
    const { data } = await api.patch<{ status: string; data: { pedido: Pedido } }>(
      `/orders/${id}/status`,
      input,
    );
    return data.data.pedido;
  },
};

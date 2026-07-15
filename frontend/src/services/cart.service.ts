import type { Carrito } from '@/types/cart';
import { api } from './api';

interface CartResponse {
  status: string;
  data: { carrito: Carrito };
}

export const cartService = {
  async get(): Promise<Carrito> {
    const { data } = await api.get<CartResponse>('/cart');
    return data.data.carrito;
  },

  async addItem(productoId: string, cantidad = 1): Promise<Carrito> {
    const { data } = await api.post<CartResponse>('/cart/items', { productoId, cantidad });
    return data.data.carrito;
  },

  async updateItem(productoId: string, cantidad: number): Promise<Carrito> {
    const { data } = await api.patch<CartResponse>(`/cart/items/${productoId}`, { cantidad });
    return data.data.carrito;
  },

  async removeItem(productoId: string): Promise<Carrito> {
    const { data } = await api.delete<CartResponse>(`/cart/items/${productoId}`);
    return data.data.carrito;
  },

  async clear(): Promise<Carrito> {
    const { data } = await api.delete<CartResponse>('/cart');
    return data.data.carrito;
  },

  async applyCoupon(codigo: string): Promise<Carrito> {
    const { data } = await api.post<CartResponse>('/cart/coupon', { codigo });
    return data.data.carrito;
  },

  async removeCoupon(): Promise<Carrito> {
    const { data } = await api.delete<CartResponse>('/cart/coupon');
    return data.data.carrito;
  },
};

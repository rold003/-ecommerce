import type { Carrito, Cupon, Imagen, ItemCarrito, Producto } from '@prisma/client';
import { prisma } from '../database/prisma';
import { cartRepository } from '../repositories/cart.repository';
import { AppError } from '../utils/AppError';
import { calculateDiscount, calculatePricing, PricingBreakdown } from './pricing.service';

type ItemConProducto = ItemCarrito & { producto: Producto & { imagenes: Imagen[] } };
type CarritoCompleto = Carrito & { items: ItemConProducto[]; cupon: Cupon | null };

export type CartWithTotals = CarritoCompleto & PricingBreakdown;

function calculateSubtotal(items: ItemConProducto[]): number {
  return items.reduce((acc, item) => acc + Number(item.producto.precio) * item.cantidad, 0);
}

function withTotals(carrito: CarritoCompleto): CartWithTotals {
  const subtotal = calculateSubtotal(carrito.items);
  const descuento = carrito.cupon ? calculateDiscount(carrito.cupon, subtotal) : 0;
  return { ...carrito, ...calculatePricing(subtotal, descuento) };
}

async function loadCart(usuarioId: string): Promise<CartWithTotals> {
  const carrito = await cartRepository.findByUserWithItems(usuarioId);
  if (!carrito) throw new AppError('Carrito no encontrado', 404);
  return withTotals(carrito);
}

export const cartService = {
  async getCart(usuarioId: string): Promise<CartWithTotals> {
    await cartRepository.getOrCreateForUser(usuarioId);
    return loadCart(usuarioId);
  },

  async addItem(usuarioId: string, productoId: string, cantidad: number): Promise<CartWithTotals> {
    const producto = await prisma.producto.findUnique({ where: { id: productoId } });
    if (!producto || producto.estado !== 'ACTIVO') {
      throw new AppError('Producto no disponible', 404);
    }

    const carrito = await cartRepository.getOrCreateForUser(usuarioId);
    const existente = await cartRepository.findItem(carrito.id, productoId);
    const nuevaCantidad = (existente?.cantidad ?? 0) + cantidad;

    if (nuevaCantidad > producto.stock) {
      throw new AppError(`Stock insuficiente. Disponible: ${producto.stock}`, 400);
    }

    if (existente) {
      await prisma.itemCarrito.update({ where: { id: existente.id }, data: { cantidad: nuevaCantidad } });
    } else {
      await prisma.itemCarrito.create({ data: { carritoId: carrito.id, productoId, cantidad: nuevaCantidad } });
    }

    return loadCart(usuarioId);
  },

  async updateItemQuantity(usuarioId: string, productoId: string, cantidad: number): Promise<CartWithTotals> {
    const carrito = await cartRepository.getOrCreateForUser(usuarioId);
    const item = await cartRepository.findItem(carrito.id, productoId);
    if (!item) throw new AppError('El producto no está en el carrito', 404);

    const producto = await prisma.producto.findUnique({ where: { id: productoId } });
    if (!producto) throw new AppError('Producto no encontrado', 404);
    if (cantidad > producto.stock) {
      throw new AppError(`Stock insuficiente. Disponible: ${producto.stock}`, 400);
    }

    await prisma.itemCarrito.update({ where: { id: item.id }, data: { cantidad } });
    return loadCart(usuarioId);
  },

  async removeItem(usuarioId: string, productoId: string): Promise<CartWithTotals> {
    const carrito = await cartRepository.getOrCreateForUser(usuarioId);
    await prisma.itemCarrito.deleteMany({ where: { carritoId: carrito.id, productoId } });
    return loadCart(usuarioId);
  },

  async clear(usuarioId: string): Promise<CartWithTotals> {
    const carrito = await cartRepository.getOrCreateForUser(usuarioId);
    await prisma.itemCarrito.deleteMany({ where: { carritoId: carrito.id } });
    return loadCart(usuarioId);
  },

  async applyCoupon(usuarioId: string, codigoInput: string): Promise<CartWithTotals> {
    const codigo = codigoInput.trim().toUpperCase();
    const cupon = await prisma.cupon.findUnique({ where: { codigo } });
    if (!cupon || !cupon.activo) throw new AppError('Cupón inválido', 400);

    const ahora = new Date();
    if (ahora < cupon.fechaInicio || ahora > cupon.fechaFin) {
      throw new AppError('El cupón no está vigente', 400);
    }
    if (cupon.usoMaximo !== null && cupon.usosActuales >= cupon.usoMaximo) {
      throw new AppError('El cupón alcanzó su límite de usos', 400);
    }

    const carrito = await cartRepository.getOrCreateForUser(usuarioId);
    const carritoConItems = await cartRepository.findByUserWithItems(usuarioId);
    const subtotal = calculateSubtotal(carritoConItems!.items);

    if (subtotal === 0) throw new AppError('Agrega productos al carrito antes de aplicar un cupón', 400);
    if (cupon.montoMinimo && subtotal < Number(cupon.montoMinimo)) {
      throw new AppError(`El monto mínimo de compra para este cupón es $${cupon.montoMinimo}`, 400);
    }

    await prisma.carrito.update({ where: { id: carrito.id }, data: { cuponId: cupon.id } });
    return loadCart(usuarioId);
  },

  async removeCoupon(usuarioId: string): Promise<CartWithTotals> {
    const carrito = await cartRepository.getOrCreateForUser(usuarioId);
    await prisma.carrito.update({ where: { id: carrito.id }, data: { cuponId: null } });
    return loadCart(usuarioId);
  },
};

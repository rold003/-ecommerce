import type { Cupon } from '@prisma/client';
import { env } from '../config/env';

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export interface PricingBreakdown {
  subtotal: number;
  descuento: number;
  iva: number;
  envio: number;
  total: number;
}

// Reutilizado por el carrito (calculo en vivo) y por el checkout/pedidos (snapshot al
// momento de confirmar la compra), para que ambos apliquen exactamente la misma regla.
export function calculatePricing(subtotal: number, descuento: number): PricingBreakdown {
  const base = Math.max(0, subtotal - descuento);
  const iva = round2(base * env.TAX_RATE);
  const envio = subtotal <= 0 || subtotal >= env.FREE_SHIPPING_THRESHOLD ? 0 : env.SHIPPING_FLAT_RATE;
  const total = round2(base + iva + envio);

  return { subtotal: round2(subtotal), descuento: round2(descuento), iva, envio, total };
}

export function calculateDiscount(cupon: Pick<Cupon, 'tipo' | 'valor'>, subtotal: number): number {
  const valor = Number(cupon.valor);
  const descuento = cupon.tipo === 'PORCENTAJE' ? subtotal * (valor / 100) : valor;
  return round2(Math.min(Math.max(0, descuento), subtotal));
}

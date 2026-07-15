import type { Prisma } from '@prisma/client';
import { describe, expect, it } from 'vitest';
import { calculateDiscount, calculatePricing } from '../../src/services/pricing.service';

// TAX_RATE=0.15, SHIPPING_FLAT_RATE=5, FREE_SHIPPING_THRESHOLD=50 (backend/.env.test)

// calculateDiscount solo llama Number(cupon.valor), asi que un numero plano
// funciona en runtime aunque el tipo real sea Prisma.Decimal.
const decimal = (n: number) => n as unknown as Prisma.Decimal;

describe('calculatePricing', () => {
  it('aplica IVA sobre el subtotal y envio plano cuando no llega al umbral', () => {
    const pricing = calculatePricing(30, 0);
    expect(pricing.subtotal).toBe(30);
    expect(pricing.descuento).toBe(0);
    expect(pricing.iva).toBe(4.5); // 30 * 0.15
    expect(pricing.envio).toBe(5);
    expect(pricing.total).toBe(39.5); // 30 + 4.5 + 5
  });

  it('el IVA se calcula sobre el subtotal YA con el descuento aplicado, no sobre el subtotal bruto', () => {
    const pricing = calculatePricing(100, 20);
    // base = 100 - 20 = 80
    expect(pricing.iva).toBe(12); // 80 * 0.15
    expect(pricing.envio).toBe(0); // 100 >= 50, envio gratis
    expect(pricing.total).toBe(92); // 80 + 12 + 0
  });

  it('da envio gratis exactamente en el umbral', () => {
    const pricing = calculatePricing(50, 0);
    expect(pricing.envio).toBe(0);
  });

  it('cobra envio justo por debajo del umbral', () => {
    const pricing = calculatePricing(49.99, 0);
    expect(pricing.envio).toBe(5);
  });

  it('no cobra envio para un carrito vacio (subtotal 0)', () => {
    const pricing = calculatePricing(0, 0);
    expect(pricing.envio).toBe(0);
    expect(pricing.total).toBe(0);
  });

  it('nunca deja la base en negativo si el descuento supera el subtotal (el envio se sigue cobrando sobre el subtotal original)', () => {
    const pricing = calculatePricing(20, 999);
    expect(pricing.iva).toBe(0);
    expect(pricing.envio).toBe(5); // el envio mira el subtotal bruto (20), no la base tras el descuento
    expect(pricing.total).toBe(5);
  });

  it('redondea a 2 decimales', () => {
    const pricing = calculatePricing(10.005, 0);
    const redondeadoA2 = (n: number) => Math.abs(Math.round(n * 100) - n * 100) < 1e-6;
    expect(redondeadoA2(pricing.iva)).toBe(true);
    expect(redondeadoA2(pricing.total)).toBe(true);
  });
});

describe('calculateDiscount', () => {
  it('calcula un porcentaje sobre el subtotal', () => {
    const descuento = calculateDiscount({ tipo: 'PORCENTAJE', valor: decimal(10) }, 100);
    expect(descuento).toBe(10);
  });

  it('aplica un monto fijo tal cual', () => {
    const descuento = calculateDiscount({ tipo: 'MONTO_FIJO', valor: decimal(15) }, 100);
    expect(descuento).toBe(15);
  });

  it('nunca deja el descuento en negativo', () => {
    const descuento = calculateDiscount({ tipo: 'MONTO_FIJO', valor: decimal(-50) }, 100);
    expect(descuento).toBe(0);
  });

  it('nunca deja que el descuento supere el subtotal (monto fijo mayor al carrito)', () => {
    const descuento = calculateDiscount({ tipo: 'MONTO_FIJO', valor: decimal(500) }, 100);
    expect(descuento).toBe(100);
  });

  it('un porcentaje del 100% descuenta todo el subtotal', () => {
    const descuento = calculateDiscount({ tipo: 'PORCENTAJE', valor: decimal(100) }, 73.5);
    expect(descuento).toBe(73.5);
  });
});

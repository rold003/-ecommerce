import { z } from 'zod';

export const addItemSchema = z.object({
  body: z.object({
    productoId: z.string().uuid('productoId inválido'),
    cantidad: z.coerce.number().int().positive().max(99).default(1),
  }),
});

export const updateItemSchema = z.object({
  body: z.object({ cantidad: z.coerce.number().int().positive().max(99) }),
  params: z.object({ productoId: z.string().uuid('productoId inválido') }),
});

export const cartItemParamsSchema = z.object({
  params: z.object({ productoId: z.string().uuid('productoId inválido') }),
});

export const applyCouponSchema = z.object({
  body: z.object({ codigo: z.string().trim().min(3, 'Código muy corto').max(30) }),
});

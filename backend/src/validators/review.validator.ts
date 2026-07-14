import { z } from 'zod';

export const createReviewSchema = z.object({
  body: z.object({
    calificacion: z.coerce.number().int().min(1, 'Mínimo 1 estrella').max(5, 'Máximo 5 estrellas'),
    comentario: z.string().trim().max(1000).optional(),
  }),
  params: z.object({ productId: z.string().uuid('productId inválido') }),
});

export const updateReviewSchema = z.object({
  body: z.object({
    calificacion: z.coerce.number().int().min(1).max(5).optional(),
    comentario: z.string().trim().max(1000).optional(),
  }),
  params: z.object({ id: z.string().uuid('id inválido') }),
});

export const reviewParamsSchema = z.object({ params: z.object({ id: z.string().uuid('id inválido') }) });

export const productReviewsQuerySchema = z.object({
  params: z.object({ productId: z.string().uuid('productId inválido') }),
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
  }),
});

export const moderateReviewSchema = z.object({
  body: z.object({ aprobada: z.boolean() }),
  params: z.object({ id: z.string().uuid('id inválido') }),
});

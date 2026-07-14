import { z } from 'zod';

export const createBrandSchema = z.object({
  body: z.object({
    nombre: z.string().trim().min(2, 'El nombre es muy corto').max(60),
    logoUrl: z.string().url('URL inválida').optional(),
  }),
});

export const updateBrandSchema = z.object({
  body: z.object({
    nombre: z.string().trim().min(2).max(60).optional(),
    logoUrl: z.string().url('URL inválida').optional(),
  }),
  params: z.object({ id: z.string().uuid('id inválido') }),
});

export const brandParamsSchema = z.object({ params: z.object({ id: z.string().uuid('id inválido') }) });

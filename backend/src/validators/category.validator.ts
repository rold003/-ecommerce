import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    nombre: z.string().trim().min(2, 'El nombre es muy corto').max(80),
    descripcion: z.string().trim().max(500).optional(),
    imagenUrl: z.string().url('URL inválida').optional(),
    categoriaPadreId: z.string().uuid('categoriaPadreId inválido').optional(),
  }),
});

export const updateCategorySchema = z.object({
  body: z.object({
    nombre: z.string().trim().min(2).max(80).optional(),
    descripcion: z.string().trim().max(500).optional(),
    imagenUrl: z.string().url('URL inválida').optional(),
    activa: z.boolean().optional(),
    categoriaPadreId: z.string().uuid('categoriaPadreId inválido').nullable().optional(),
  }),
  params: z.object({ id: z.string().uuid('id inválido') }),
});

export const categoryParamsSchema = z.object({ params: z.object({ id: z.string().uuid('id inválido') }) });

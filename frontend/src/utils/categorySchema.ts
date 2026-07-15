import { z } from 'zod';

export const categorySchema = z.object({
  nombre: z.string().trim().min(2, 'Muy corto'),
  descripcion: z.string().trim().optional(),
  imagenUrl: z.string().trim().url('URL inválida').optional().or(z.literal('')),
  categoriaPadreId: z.string().optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

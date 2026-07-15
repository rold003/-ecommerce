import { z } from 'zod';

export const brandSchema = z.object({
  nombre: z.string().trim().min(2, 'Muy corto'),
  logoUrl: z.string().trim().url('URL inválida').optional().or(z.literal('')),
});

export type BrandFormValues = z.infer<typeof brandSchema>;

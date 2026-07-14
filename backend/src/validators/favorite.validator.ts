import { z } from 'zod';

export const favoriteParamsSchema = z.object({
  params: z.object({ productId: z.string().uuid('productId inválido') }),
});

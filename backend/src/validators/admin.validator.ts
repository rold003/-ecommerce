import { z } from 'zod';

export const salesReportQuerySchema = z.object({
  query: z
    .object({
      desde: z.coerce.date(),
      hasta: z.coerce.date(),
    })
    .refine((data) => data.hasta >= data.desde, {
      message: 'hasta debe ser posterior o igual a desde',
      path: ['hasta'],
    }),
});

export const listUsersSchema = z.object({
  query: z.object({
    rol: z.enum(['CLIENTE', 'ADMIN']).optional(),
    q: z.string().trim().max(100).optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
  }),
});

export const updateUserAdminSchema = z.object({
  body: z.object({
    activo: z.boolean().optional(),
    rol: z.enum(['CLIENTE', 'ADMIN']).optional(),
  }),
  params: z.object({ id: z.string().uuid('id inválido') }),
});

export type ListUsersQuery = z.infer<typeof listUsersSchema>['query'];
export type SalesReportQuery = z.infer<typeof salesReportQuerySchema>['query'];

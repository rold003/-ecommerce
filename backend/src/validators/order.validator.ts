import { z } from 'zod';

const estadoPedidoEnum = z.enum(['PENDIENTE', 'PAGADO', 'ENVIADO', 'ENTREGADO', 'CANCELADO']);

export const checkoutSchema = z.object({
  body: z.object({
    direccionId: z.string().uuid('direccionId inválido'),
    metodoPago: z.enum(['TARJETA', 'PAYPAL', 'TRANSFERENCIA', 'CONTRA_ENTREGA']),
    notas: z.string().trim().max(500).optional(),
  }),
});

export const listOrdersSchema = z.object({
  query: z.object({
    estado: estadoPedidoEnum.optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
  }),
});

export const orderParamsSchema = z.object({ params: z.object({ id: z.string().uuid('id inválido') }) });

export const updateStatusSchema = z.object({
  body: z.object({
    estado: estadoPedidoEnum,
    numeroSeguimiento: z.string().trim().max(100).optional(),
  }),
  params: z.object({ id: z.string().uuid('id inválido') }),
});

export type ListOrdersQuery = z.infer<typeof listOrdersSchema>['query'];

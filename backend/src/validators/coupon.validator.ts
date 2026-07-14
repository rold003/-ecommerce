import { z } from 'zod';

const couponBodyBase = z.object({
  codigo: z
    .string()
    .trim()
    .min(3, 'El código es muy corto')
    .max(30)
    .transform((v) => v.toUpperCase()),
  tipo: z.enum(['PORCENTAJE', 'MONTO_FIJO']),
  valor: z.coerce.number().positive('El valor debe ser mayor a 0'),
  fechaInicio: z.coerce.date(),
  fechaFin: z.coerce.date(),
  usoMaximo: z.coerce.number().int().positive().optional(),
  montoMinimo: z.coerce.number().nonnegative().optional(),
  activo: z.boolean().optional(),
});

export const createCouponSchema = z.object({
  body: couponBodyBase.superRefine((data, ctx) => {
    if (data.fechaFin <= data.fechaInicio) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'fechaFin debe ser posterior a fechaInicio',
        path: ['fechaFin'],
      });
    }
    if (data.tipo === 'PORCENTAJE' && data.valor > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Un cupón porcentual no puede superar 100',
        path: ['valor'],
      });
    }
  }),
});

export const updateCouponSchema = z.object({
  body: couponBodyBase.partial(),
  params: z.object({ id: z.string().uuid('id inválido') }),
});

export const couponParamsSchema = z.object({ params: z.object({ id: z.string().uuid('id inválido') }) });

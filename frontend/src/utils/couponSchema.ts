import { z } from 'zod';

export const couponSchema = z
  .object({
    codigo: z.string().trim().min(3, 'Muy corto').max(30),
    tipo: z.enum(['PORCENTAJE', 'MONTO_FIJO']),
    valor: z.coerce.number().positive('Debe ser mayor a 0'),
    fechaInicio: z.string().min(1, 'Requerido'),
    fechaFin: z.string().min(1, 'Requerido'),
    usoMaximo: z.string().optional(),
    montoMinimo: z.string().optional(),
  })
  .refine((data) => new Date(data.fechaFin) > new Date(data.fechaInicio), {
    message: 'Debe ser posterior a la fecha de inicio',
    path: ['fechaFin'],
  })
  .refine((data) => data.tipo !== 'PORCENTAJE' || data.valor <= 100, {
    message: 'Un cupón porcentual no puede superar 100',
    path: ['valor'],
  });

export type CouponFormValues = z.infer<typeof couponSchema>;

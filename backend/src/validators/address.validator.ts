import { z } from 'zod';

const addressBody = z.object({
  etiqueta: z.string().trim().min(2, 'La etiqueta es muy corta').max(30),
  destinatario: z.string().trim().min(2).max(80),
  telefono: z.string().trim().min(7).max(20),
  calle: z.string().trim().min(3).max(120),
  numero: z.string().trim().max(20).optional(),
  ciudad: z.string().trim().min(2).max(60),
  provincia: z.string().trim().min(2).max(60),
  codigoPostal: z.string().trim().min(3).max(15),
  pais: z.string().trim().min(2).max(60).optional(),
  referencia: z.string().trim().max(200).optional(),
  predeterminada: z.boolean().optional(),
});

export const addressSchema = z.object({ body: addressBody });

export const updateAddressSchema = z.object({
  body: addressBody.partial(),
  params: z.object({ id: z.string().uuid('id inválido') }),
});

export const addressParamsSchema = z.object({
  params: z.object({ id: z.string().uuid('id inválido') }),
});

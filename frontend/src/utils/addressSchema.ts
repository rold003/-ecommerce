import { z } from 'zod';

export const addressSchema = z.object({
  etiqueta: z.string().trim().min(2, 'Requerido'),
  destinatario: z.string().trim().min(2, 'Requerido'),
  telefono: z.string().trim().min(7, 'Requerido'),
  calle: z.string().trim().min(3, 'Requerido'),
  numero: z.string().trim().optional(),
  ciudad: z.string().trim().min(2, 'Requerido'),
  provincia: z.string().trim().min(2, 'Requerido'),
  codigoPostal: z.string().trim().min(3, 'Requerido'),
  referencia: z.string().trim().optional(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;

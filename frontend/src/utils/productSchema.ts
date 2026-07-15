import { z } from 'zod';

export const productSchema = z.object({
  nombre: z.string().trim().min(3, 'Muy corto'),
  descripcion: z.string().trim().min(10, 'Muy corta (mínimo 10 caracteres)'),
  precio: z.coerce.number().positive('Debe ser mayor a 0'),
  precioAnterior: z.string().optional(),
  stock: z.coerce.number().int().nonnegative('No puede ser negativo'),
  sku: z.string().trim().min(3, 'Muy corto'),
  categoriaId: z.string().min(1, 'Selecciona una categoría'),
  marcaId: z.string().min(1, 'Selecciona una marca'),
  color: z.string().trim().optional(),
  talla: z.string().trim().optional(),
  destacado: z.boolean().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

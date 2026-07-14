import { z } from 'zod';

const booleanQuery = z
  .enum(['true', 'false'])
  .optional()
  .transform((v) => (v === undefined ? undefined : v === 'true'));

export const listProductsSchema = z.object({
  query: z.object({
    categoria: z.string().trim().optional(),
    marca: z.string().trim().optional(),
    precioMin: z.coerce.number().nonnegative().optional(),
    precioMax: z.coerce.number().nonnegative().optional(),
    valoracionMin: z.coerce.number().min(0).max(5).optional(),
    disponible: booleanQuery,
    destacado: booleanQuery,
    q: z.string().trim().max(100).optional(),
    sort: z
      .enum(['precio_asc', 'precio_desc', 'mas_vendidos', 'mas_recientes', 'mejor_valorados'])
      .optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
  }),
});

const imagenSchema = z.object({
  url: z.string().url('URL de imagen inválida'),
  publicId: z.string().optional(),
  altText: z.string().max(150).optional(),
  orden: z.number().int().nonnegative().optional(),
  esPrincipal: z.boolean().optional(),
});

const productBody = z.object({
  nombre: z.string().trim().min(3, 'El nombre es muy corto').max(150),
  descripcion: z.string().trim().min(10, 'La descripción es muy corta').max(5000),
  precio: z.coerce.number().positive('El precio debe ser mayor a 0'),
  precioAnterior: z.coerce.number().positive().optional(),
  stock: z.coerce.number().int().nonnegative(),
  sku: z.string().trim().min(3).max(50),
  peso: z.coerce.number().positive().optional(),
  color: z.string().trim().max(50).optional(),
  talla: z.string().trim().max(20).optional(),
  categoriaId: z.string().uuid('categoriaId inválido'),
  marcaId: z.string().uuid('marcaId inválido'),
  destacado: z.boolean().optional(),
  estado: z.enum(['ACTIVO', 'INACTIVO']).optional(),
  imagenes: z.array(imagenSchema).max(10).optional(),
});

export const createProductSchema = z.object({ body: productBody });

export const updateProductSchema = z.object({
  body: productBody.partial(),
  params: z.object({ id: z.string().uuid('id inválido') }),
});

export const productParamsSchema = z.object({ params: z.object({ id: z.string().uuid('id inválido') }) });

export const productImageParamsSchema = z.object({
  params: z.object({ id: z.string().uuid('id inválido'), imageId: z.string().uuid('imageId inválido') }),
});

export type CreateProductInput = z.infer<typeof createProductSchema>['body'];
export type UpdateProductInput = z.infer<typeof updateProductSchema>['body'];
export type ListProductsQuery = z.infer<typeof listProductsSchema>['query'];

export interface Imagen {
  id: string;
  url: string;
  altText: string | null;
  orden: number;
  esPrincipal: boolean;
}

export interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  imagenUrl: string | null;
  activa: boolean;
  categoriaPadreId: string | null;
  subcategorias?: Categoria[];
}

export interface Marca {
  id: string;
  nombre: string;
  slug: string;
  logoUrl: string | null;
}

export interface Producto {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string;
  precio: string;
  precioAnterior: string | null;
  stock: number;
  sku: string;
  peso: string | null;
  color: string | null;
  talla: string | null;
  estado: 'ACTIVO' | 'INACTIVO';
  destacado: boolean;
  valoracionProm: string;
  totalResenas: number;
  vendidos: number;
  categoriaId: string;
  marcaId: string;
  categoria: Categoria;
  marca: Marca;
  imagenes: Imagen[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductoSugerencia {
  id: string;
  nombre: string;
  slug: string;
  precio: string;
  imagenes: { url: string }[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

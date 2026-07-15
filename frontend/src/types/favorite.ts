import type { Producto } from './product';

export interface Favorito {
  id: string;
  productoId: string;
  producto: Producto;
  createdAt: string;
}

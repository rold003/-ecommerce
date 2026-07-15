import type { Producto } from './product';

export interface ItemCarrito {
  id: string;
  productoId: string;
  cantidad: number;
  producto: Producto;
}

export interface CuponAplicado {
  id: string;
  codigo: string;
  tipo: 'PORCENTAJE' | 'MONTO_FIJO';
  valor: string;
}

export interface Carrito {
  id: string;
  items: ItemCarrito[];
  cupon: CuponAplicado | null;
  subtotal: number;
  descuento: number;
  iva: number;
  envio: number;
  total: number;
}

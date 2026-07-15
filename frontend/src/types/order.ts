import type { Direccion } from './address';

export interface DetallePedido {
  id: string;
  productoId: string;
  nombreProducto: string;
  precioUnitario: string;
  cantidad: number;
  subtotal: string;
}

export interface Pago {
  id: string;
  metodo: string;
  estado: string;
  monto: string;
  pagadoEn: string | null;
}

export type EstadoPedido = 'PENDIENTE' | 'PAGADO' | 'ENVIADO' | 'ENTREGADO' | 'CANCELADO';

export interface Pedido {
  id: string;
  numero: string;
  subtotal: string;
  iva: string;
  costoEnvio: string;
  descuento: string;
  total: string;
  metodoPago: string;
  estado: EstadoPedido;
  numeroSeguimiento: string | null;
  notas: string | null;
  items: DetallePedido[];
  pago: Pago;
  direccion: Direccion;
  createdAt: string;
}

export interface PedidoAdmin extends Pedido {
  usuario: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
  };
}

import type { Producto } from './product';
import type { Rol } from './user';

export interface DashboardData {
  ventasHoy: { total: number; pedidos: number };
  ventasMes: { total: number; pedidos: number };
  pedidosPendientes: number;
  clientesNuevosMes: number;
  totalProductos: number;
  totalClientes: number;
  pedidosPorEstado: { estado: string; cantidad: number }[];
  productosMasVendidos: (Producto & { vendidos: number })[];
  ventasDiarias: { fecha: string; total: number }[];
}

export interface SalesReport {
  totalVentas: number;
  totalPedidos: number;
  productosMasVendidos: {
    productoId: string;
    nombre: string;
    unidadesVendidas: number;
    ingresos: number;
  }[];
}

export interface AdminUsuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string | null;
  rol: Rol;
  activo: boolean;
  createdAt: string;
}

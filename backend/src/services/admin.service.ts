import type { Prisma, Rol } from '@prisma/client';
import { prisma } from '../database/prisma';
import { adminRepository } from '../repositories/admin.repository';
import { AppError } from '../utils/AppError';
import { buildMeta, parsePagination } from '../utils/pagination';
import type { ListUsersQuery } from '../validators/admin.validator';

// Se usa UTC explícito (no setHours/local) porque el servidor puede correr en cualquier
// zona horaria (ej. America/Guayaquil, UTC-5): con hora local, "fin de día" terminaría
// horas antes de medianoche UTC real, excluyendo pedidos creados esa misma tarde/noche.
// z.coerce.date() sobre "YYYY-MM-DD" siempre produce medianoche UTC, así que el rango
// debe construirse en UTC para ser consistente con eso.
function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setUTCHours(23, 59, 59, 999);
  return d;
}

export const adminService = {
  async listUsers(query: ListUsersQuery) {
    const { page, limit, skip } = parsePagination(query);
    const where: Prisma.UsuarioWhereInput = {
      ...(query.rol ? { rol: query.rol } : {}),
      ...(query.q
        ? {
            OR: [
              { nombre: { contains: query.q, mode: 'insensitive' } },
              { apellido: { contains: query.q, mode: 'insensitive' } },
              { email: { contains: query.q, mode: 'insensitive' } },
            ],
          }
        : {}),
    };
    const { items, total } = await adminRepository.findManyUsers(where, skip, limit);
    return { items, meta: buildMeta(total, page, limit) };
  },

  async updateUser(id: string, data: { activo?: boolean; rol?: Rol }, actorId: string) {
    if (id === actorId && data.rol === 'CLIENTE') {
      throw new AppError('No puedes quitarte tu propio rol de administrador', 400);
    }
    if (id === actorId && data.activo === false) {
      throw new AppError('No puedes desactivar tu propia cuenta', 400);
    }

    const usuario = await prisma.usuario.findUnique({ where: { id } });
    if (!usuario) throw new AppError('Usuario no encontrado', 404);

    return adminRepository.updateUser(id, data);
  },

  async getDashboard() {
    const hoy = startOfDay(new Date());
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const hace30dias = new Date(hoy);
    hace30dias.setDate(hace30dias.getDate() - 29);

    const [
      ventasHoyAgg,
      ventasMesAgg,
      pedidosPendientes,
      clientesNuevosMes,
      totalProductos,
      totalClientes,
      pedidosPorEstado,
      productosMasVendidos,
      pedidosUltimos30,
    ] = await Promise.all([
      prisma.pedido.aggregate({
        where: { createdAt: { gte: hoy }, estado: { not: 'CANCELADO' } },
        _sum: { total: true },
        _count: true,
      }),
      prisma.pedido.aggregate({
        where: { createdAt: { gte: inicioMes }, estado: { not: 'CANCELADO' } },
        _sum: { total: true },
        _count: true,
      }),
      prisma.pedido.count({ where: { estado: 'PENDIENTE' } }),
      prisma.usuario.count({ where: { rol: 'CLIENTE', createdAt: { gte: inicioMes } } }),
      prisma.producto.count({ where: { estado: 'ACTIVO' } }),
      prisma.usuario.count({ where: { rol: 'CLIENTE' } }),
      prisma.pedido.groupBy({ by: ['estado'], _count: { _all: true } }),
      prisma.producto.findMany({
        orderBy: { vendidos: 'desc' },
        take: 5,
        select: {
          id: true,
          nombre: true,
          vendidos: true,
          precio: true,
          imagenes: { take: 1, orderBy: { orden: 'asc' }, select: { url: true } },
        },
      }),
      prisma.pedido.findMany({
        where: { createdAt: { gte: hace30dias }, estado: { not: 'CANCELADO' } },
        select: { createdAt: true, total: true },
      }),
    ]);

    // Se agrupan las ventas por dia en JS (mas simple y portable entre motores de BD
    // que un date_trunc en SQL crudo, y evita tener que escribir SQL manual).
    const ventasPorDiaMap = new Map<string, number>();
    for (let i = 0; i < 30; i++) {
      const dia = new Date(hace30dias);
      dia.setDate(dia.getDate() + i);
      ventasPorDiaMap.set(dia.toISOString().slice(0, 10), 0);
    }
    for (const pedido of pedidosUltimos30) {
      const key = pedido.createdAt.toISOString().slice(0, 10);
      ventasPorDiaMap.set(key, (ventasPorDiaMap.get(key) ?? 0) + Number(pedido.total));
    }
    const ventasDiarias = Array.from(ventasPorDiaMap.entries()).map(([fecha, total]) => ({
      fecha,
      total: Math.round(total * 100) / 100,
    }));

    return {
      ventasHoy: { total: Number(ventasHoyAgg._sum.total ?? 0), pedidos: ventasHoyAgg._count },
      ventasMes: { total: Number(ventasMesAgg._sum.total ?? 0), pedidos: ventasMesAgg._count },
      pedidosPendientes,
      clientesNuevosMes,
      totalProductos,
      totalClientes,
      pedidosPorEstado: pedidosPorEstado.map((p) => ({ estado: p.estado, cantidad: p._count._all })),
      productosMasVendidos,
      ventasDiarias,
    };
  },

  async getSalesReport(desde: Date, hasta: Date) {
    const where: Prisma.PedidoWhereInput = {
      createdAt: { gte: startOfDay(desde), lte: endOfDay(hasta) },
      estado: { not: 'CANCELADO' },
    };

    const [resumen, productosVendidos] = await Promise.all([
      prisma.pedido.aggregate({
        where,
        _sum: { total: true, subtotal: true, iva: true, costoEnvio: true, descuento: true },
        _count: true,
      }),
      prisma.detallePedido.groupBy({
        by: ['productoId', 'nombreProducto'],
        where: { pedido: where },
        _sum: { cantidad: true, subtotal: true },
        orderBy: { _sum: { cantidad: 'desc' } },
        take: 10,
      }),
    ]);

    return {
      totalVentas: Number(resumen._sum.total ?? 0),
      totalPedidos: resumen._count,
      productosMasVendidos: productosVendidos.map((p) => ({
        productoId: p.productoId,
        nombre: p.nombreProducto,
        unidadesVendidas: p._sum.cantidad ?? 0,
        ingresos: Number(p._sum.subtotal ?? 0),
      })),
    };
  },
};

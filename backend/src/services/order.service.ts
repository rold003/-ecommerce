import type { EstadoPedido, MetodoPago, Prisma } from '@prisma/client';
import { prisma } from '../database/prisma';
import { orderInclude, orderRepository } from '../repositories/order.repository';
import { AppError } from '../utils/AppError';
import { sendEmail } from '../utils/email';
import { buildMeta, parsePagination } from '../utils/pagination';
import { calculateDiscount, calculatePricing } from './pricing.service';
import { paymentService } from './payment.service';

const ALLOWED_TRANSITIONS: Record<EstadoPedido, EstadoPedido[]> = {
  PENDIENTE: ['PAGADO', 'CANCELADO'],
  PAGADO: ['ENVIADO', 'CANCELADO'],
  ENVIADO: ['ENTREGADO'],
  ENTREGADO: [],
  CANCELADO: [],
};

interface ListQuery {
  estado?: EstadoPedido;
  page?: number;
  limit?: number;
}

export const orderService = {
  async checkout(usuarioId: string, direccionId: string, metodoPago: MetodoPago, notas?: string) {
    const direccion = await prisma.direccion.findFirst({ where: { id: direccionId, usuarioId } });
    if (!direccion) throw new AppError('Dirección no encontrada', 404);

    const carrito = await prisma.carrito.findUnique({
      where: { usuarioId },
      include: { items: { include: { producto: true } }, cupon: true },
    });
    if (!carrito || carrito.items.length === 0) throw new AppError('El carrito está vacío', 400);

    const subtotal = carrito.items.reduce((acc, item) => acc + Number(item.producto.precio) * item.cantidad, 0);
    const descuento = carrito.cupon ? calculateDiscount(carrito.cupon, subtotal) : 0;
    const pricing = calculatePricing(subtotal, descuento);
    const estadoPago = paymentService.resolveInitialStatus(metodoPago);

    const pedido = await prisma.$transaction(async (tx) => {
      for (const item of carrito.items) {
        if (item.producto.estado !== 'ACTIVO') {
          throw new AppError(`"${item.producto.nombre}" ya no está disponible`, 409);
        }
        // Decremento atomico: solo tiene efecto si aun hay stock suficiente en este
        // instante, evitando sobreventa por condiciones de carrera entre checkouts.
        const resultado = await tx.producto.updateMany({
          where: { id: item.productoId, stock: { gte: item.cantidad } },
          data: { stock: { decrement: item.cantidad }, vendidos: { increment: item.cantidad } },
        });
        if (resultado.count === 0) {
          throw new AppError(`Stock insuficiente para "${item.producto.nombre}"`, 409);
        }
      }

      const totalPedidos = await tx.pedido.count();
      const numero = `PED-${String(totalPedidos + 1).padStart(6, '0')}`;

      const nuevoPedido = await tx.pedido.create({
        data: {
          numero,
          usuarioId,
          direccionId,
          subtotal: pricing.subtotal,
          iva: pricing.iva,
          costoEnvio: pricing.envio,
          descuento: pricing.descuento,
          total: pricing.total,
          metodoPago,
          estado: estadoPago === 'COMPLETADO' ? 'PAGADO' : 'PENDIENTE',
          cuponId: carrito.cuponId,
          notas,
          items: {
            create: carrito.items.map((item) => ({
              productoId: item.productoId,
              nombreProducto: item.producto.nombre,
              precioUnitario: item.producto.precio,
              cantidad: item.cantidad,
              subtotal: Number(item.producto.precio) * item.cantidad,
            })),
          },
          pago: {
            create: {
              metodo: metodoPago,
              estado: estadoPago,
              monto: pricing.total,
              pagadoEn: estadoPago === 'COMPLETADO' ? new Date() : null,
            },
          },
        },
        include: orderInclude,
      });

      if (carrito.cuponId) {
        await tx.cupon.update({ where: { id: carrito.cuponId }, data: { usosActuales: { increment: 1 } } });
      }

      await tx.itemCarrito.deleteMany({ where: { carritoId: carrito.id } });
      await tx.carrito.update({ where: { id: carrito.id }, data: { cuponId: null } });

      return nuevoPedido;
    });

    const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
    if (usuario) {
      sendEmail({
        to: usuario.email,
        subject: `Pedido confirmado ${pedido.numero}`,
        html: `<p>Hola ${usuario.nombre}, tu pedido <strong>${pedido.numero}</strong> por $${pedido.total} fue recibido correctamente. Te avisaremos cuando sea enviado.</p>`,
      }).catch((err: unknown) => console.error('Error enviando email de pedido:', err));
    }

    return pedido;
  },

  async listForUser(usuarioId: string, query: ListQuery) {
    const { page, limit, skip } = parsePagination(query);
    const where: Prisma.PedidoWhereInput = query.estado ? { estado: query.estado } : {};
    const { items, total } = await orderRepository.findManyForUser(usuarioId, where, skip, limit);
    return { items, meta: buildMeta(total, page, limit) };
  },

  async listAdmin(query: ListQuery) {
    const { page, limit, skip } = parsePagination(query);
    const where: Prisma.PedidoWhereInput = query.estado ? { estado: query.estado } : {};
    const { items, total } = await orderRepository.findManyAdmin(where, skip, limit);
    return { items, meta: buildMeta(total, page, limit) };
  },

  async getById(id: string, usuarioId: string, esAdmin: boolean) {
    const pedido = await orderRepository.findById(id);
    if (!pedido) throw new AppError('Pedido no encontrado', 404);
    if (!esAdmin && pedido.usuarioId !== usuarioId) throw new AppError('Pedido no encontrado', 404);
    return pedido;
  },

  async updateStatus(id: string, nuevoEstado: EstadoPedido, numeroSeguimiento?: string) {
    const pedido = await prisma.pedido.findUnique({ where: { id }, include: { items: true } });
    if (!pedido) throw new AppError('Pedido no encontrado', 404);

    if (!ALLOWED_TRANSITIONS[pedido.estado].includes(nuevoEstado)) {
      throw new AppError(`No se puede cambiar el pedido de ${pedido.estado} a ${nuevoEstado}`, 400);
    }

    const actualizado = await prisma.$transaction(async (tx) => {
      if (nuevoEstado === 'CANCELADO') {
        for (const item of pedido.items) {
          await tx.producto.update({
            where: { id: item.productoId },
            data: { stock: { increment: item.cantidad }, vendidos: { decrement: item.cantidad } },
          });
        }
      }

      return tx.pedido.update({
        where: { id },
        data: {
          estado: nuevoEstado,
          ...(numeroSeguimiento ? { numeroSeguimiento } : {}),
          ...(nuevoEstado === 'PAGADO'
            ? { pago: { update: { estado: 'COMPLETADO', pagadoEn: new Date() } } }
            : {}),
        },
        include: orderInclude,
      });
    });

    if (nuevoEstado === 'ENVIADO' || nuevoEstado === 'ENTREGADO') {
      const usuario = await prisma.usuario.findUnique({ where: { id: actualizado.usuarioId } });
      if (usuario) {
        const esEnviado = nuevoEstado === 'ENVIADO';
        const asunto = esEnviado ? 'Tu pedido fue enviado' : 'Tu pedido fue entregado';
        const seguimiento =
          esEnviado && numeroSeguimiento ? `<p>Número de seguimiento: <strong>${numeroSeguimiento}</strong></p>` : '';
        sendEmail({
          to: usuario.email,
          subject: `${asunto} - ${actualizado.numero}`,
          html: `<p>Hola ${usuario.nombre}, tu pedido <strong>${actualizado.numero}</strong> ${esEnviado ? 'fue enviado' : 'fue entregado'}.</p>${seguimiento}`,
        }).catch((err: unknown) => console.error('Error enviando email de estado de pedido:', err));
      }
    }

    return actualizado;
  },

  async cancelByCustomer(id: string, usuarioId: string) {
    const pedido = await prisma.pedido.findUnique({ where: { id } });
    if (!pedido || pedido.usuarioId !== usuarioId) throw new AppError('Pedido no encontrado', 404);
    if (pedido.estado !== 'PENDIENTE' && pedido.estado !== 'PAGADO') {
      throw new AppError('Este pedido ya no se puede cancelar', 400);
    }
    return orderService.updateStatus(id, 'CANCELADO');
  },
};

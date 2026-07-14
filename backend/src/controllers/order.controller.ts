import type { EstadoPedido } from '@prisma/client';
import { Request, Response } from 'express';
import { orderService } from '../services/order.service';
import { asyncHandler } from '../utils/asyncHandler';
import type { ListOrdersQuery } from '../validators/order.validator';

export const checkout = asyncHandler(async (req: Request, res: Response) => {
  const pedido = await orderService.checkout(
    req.user!.sub,
    req.body.direccionId,
    req.body.metodoPago,
    req.body.notas,
  );
  res.status(201).json({ status: 'success', data: { pedido } });
});

export const listMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const query = (req.validated?.query ?? {}) as ListOrdersQuery;
  const { items, meta } = await orderService.listForUser(req.user!.sub, query);
  res.json({ status: 'success', data: items, meta });
});

export const listAllOrders = asyncHandler(async (req: Request, res: Response) => {
  const query = (req.validated?.query ?? {}) as ListOrdersQuery;
  const { items, meta } = await orderService.listAdmin(query);
  res.json({ status: 'success', data: items, meta });
});

export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const esAdmin = req.user!.rol === 'ADMIN';
  const pedido = await orderService.getById(req.params.id as string, req.user!.sub, esAdmin);
  res.json({ status: 'success', data: { pedido } });
});

export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const estado = req.body.estado as EstadoPedido;
  const pedido = await orderService.updateStatus(req.params.id as string, estado, req.body.numeroSeguimiento);
  res.json({ status: 'success', data: { pedido } });
});

export const cancelOrder = asyncHandler(async (req: Request, res: Response) => {
  const pedido = await orderService.cancelByCustomer(req.params.id as string, req.user!.sub);
  res.json({ status: 'success', data: { pedido } });
});

import { Request, Response } from 'express';
import { cartService } from '../services/cart.service';
import { asyncHandler } from '../utils/asyncHandler';

export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const carrito = await cartService.getCart(req.user!.sub);
  res.json({ status: 'success', data: { carrito } });
});

export const addItem = asyncHandler(async (req: Request, res: Response) => {
  const carrito = await cartService.addItem(req.user!.sub, req.body.productoId, req.body.cantidad);
  res.status(201).json({ status: 'success', data: { carrito } });
});

export const updateItemQuantity = asyncHandler(async (req: Request, res: Response) => {
  const carrito = await cartService.updateItemQuantity(
    req.user!.sub,
    req.params.productoId as string,
    req.body.cantidad,
  );
  res.json({ status: 'success', data: { carrito } });
});

export const removeItem = asyncHandler(async (req: Request, res: Response) => {
  const carrito = await cartService.removeItem(req.user!.sub, req.params.productoId as string);
  res.json({ status: 'success', data: { carrito } });
});

export const clearCart = asyncHandler(async (req: Request, res: Response) => {
  const carrito = await cartService.clear(req.user!.sub);
  res.json({ status: 'success', data: { carrito } });
});

export const applyCoupon = asyncHandler(async (req: Request, res: Response) => {
  const carrito = await cartService.applyCoupon(req.user!.sub, req.body.codigo);
  res.json({ status: 'success', data: { carrito } });
});

export const removeCoupon = asyncHandler(async (req: Request, res: Response) => {
  const carrito = await cartService.removeCoupon(req.user!.sub);
  res.json({ status: 'success', data: { carrito } });
});

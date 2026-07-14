import { Request, Response } from 'express';
import { productService } from '../services/product.service';
import { asyncHandler } from '../utils/asyncHandler';
import type { ListProductsQuery } from '../validators/product.validator';

export const listProducts = asyncHandler(async (req: Request, res: Response) => {
  const query = (req.validated?.query ?? {}) as ListProductsQuery;
  const { items, meta } = await productService.list(query, true);
  res.json({ status: 'success', data: items, meta });
});

export const listProductsAdmin = asyncHandler(async (req: Request, res: Response) => {
  const query = (req.validated?.query ?? {}) as ListProductsQuery;
  const { items, meta } = await productService.list(query, false);
  res.json({ status: 'success', data: items, meta });
});

export const getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
  const esAdmin = req.user?.rol === 'ADMIN';
  const producto = await productService.getBySlug(req.params.slug as string, !esAdmin);
  res.json({ status: 'success', data: { producto } });
});

export const autocomplete = asyncHandler(async (req: Request, res: Response) => {
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  const productos = q.length >= 2 ? await productService.autocomplete(q) : [];
  res.json({ status: 'success', data: { productos } });
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const producto = await productService.create(req.body);
  res.status(201).json({ status: 'success', data: { producto } });
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const producto = await productService.update(req.params.id as string, req.body);
  res.json({ status: 'success', data: { producto } });
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  await productService.softDelete(req.params.id as string);
  res.status(204).send();
});

export const deleteProductImage = asyncHandler(async (req: Request, res: Response) => {
  await productService.removeImage(req.params.id as string, req.params.imageId as string);
  res.status(204).send();
});

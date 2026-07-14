import { Request, Response } from 'express';
import { brandService } from '../services/brand.service';
import { asyncHandler } from '../utils/asyncHandler';

export const listBrands = asyncHandler(async (_req: Request, res: Response) => {
  const marcas = await brandService.list();
  res.json({ status: 'success', data: { marcas } });
});

export const getBrandBySlug = asyncHandler(async (req: Request, res: Response) => {
  const marca = await brandService.getBySlug(req.params.slug as string);
  res.json({ status: 'success', data: { marca } });
});

export const createBrand = asyncHandler(async (req: Request, res: Response) => {
  const marca = await brandService.create(req.body);
  res.status(201).json({ status: 'success', data: { marca } });
});

export const updateBrand = asyncHandler(async (req: Request, res: Response) => {
  const marca = await brandService.update(req.params.id as string, req.body);
  res.json({ status: 'success', data: { marca } });
});

export const deleteBrand = asyncHandler(async (req: Request, res: Response) => {
  await brandService.remove(req.params.id as string);
  res.status(204).send();
});

import { Request, Response } from 'express';
import { categoryService } from '../services/category.service';
import { asyncHandler } from '../utils/asyncHandler';

export const listCategories = asyncHandler(async (req: Request, res: Response) => {
  const esAdmin = req.user?.rol === 'ADMIN';
  const categorias = await categoryService.list(!esAdmin);
  res.json({ status: 'success', data: { categorias } });
});

export const getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
  const categoria = await categoryService.getBySlug(req.params.slug as string);
  res.json({ status: 'success', data: { categoria } });
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const categoria = await categoryService.create(req.body);
  res.status(201).json({ status: 'success', data: { categoria } });
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const categoria = await categoryService.update(req.params.id as string, req.body);
  res.json({ status: 'success', data: { categoria } });
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  await categoryService.remove(req.params.id as string);
  res.status(204).send();
});

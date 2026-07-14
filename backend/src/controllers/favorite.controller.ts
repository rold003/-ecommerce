import { Request, Response } from 'express';
import { favoriteService } from '../services/favorite.service';
import { asyncHandler } from '../utils/asyncHandler';

export const listFavorites = asyncHandler(async (req: Request, res: Response) => {
  const favoritos = await favoriteService.list(req.user!.sub);
  res.json({ status: 'success', data: { favoritos } });
});

export const addFavorite = asyncHandler(async (req: Request, res: Response) => {
  const favorito = await favoriteService.add(req.user!.sub, req.params.productId as string);
  res.status(201).json({ status: 'success', data: { favorito } });
});

export const removeFavorite = asyncHandler(async (req: Request, res: Response) => {
  await favoriteService.remove(req.user!.sub, req.params.productId as string);
  res.status(204).send();
});

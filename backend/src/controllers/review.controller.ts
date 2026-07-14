import { Request, Response } from 'express';
import { reviewService } from '../services/review.service';
import { asyncHandler } from '../utils/asyncHandler';

export const listProductReviews = asyncHandler(async (req: Request, res: Response) => {
  const query = (req.validated?.query ?? {}) as { page?: number; limit?: number };
  const { items, meta } = await reviewService.list(req.params.productId as string, query.page, query.limit);
  res.json({ status: 'success', data: items, meta });
});

export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const resena = await reviewService.create(
    req.user!.sub,
    req.params.productId as string,
    req.body.calificacion,
    req.body.comentario,
  );
  res.status(201).json({ status: 'success', data: { resena } });
});

export const updateReview = asyncHandler(async (req: Request, res: Response) => {
  const resena = await reviewService.update(req.params.id as string, req.user!.sub, req.body);
  res.json({ status: 'success', data: { resena } });
});

export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  const esAdmin = req.user!.rol === 'ADMIN';
  await reviewService.remove(req.params.id as string, req.user!.sub, esAdmin);
  res.status(204).send();
});

export const moderateReview = asyncHandler(async (req: Request, res: Response) => {
  const resena = await reviewService.moderate(req.params.id as string, req.body.aprobada);
  res.json({ status: 'success', data: { resena } });
});

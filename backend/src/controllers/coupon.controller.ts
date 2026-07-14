import { Request, Response } from 'express';
import { couponService } from '../services/coupon.service';
import { asyncHandler } from '../utils/asyncHandler';

export const listCoupons = asyncHandler(async (_req: Request, res: Response) => {
  const cupones = await couponService.list();
  res.json({ status: 'success', data: { cupones } });
});

export const createCoupon = asyncHandler(async (req: Request, res: Response) => {
  const cupon = await couponService.create(req.body);
  res.status(201).json({ status: 'success', data: { cupon } });
});

export const updateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const cupon = await couponService.update(req.params.id as string, req.body);
  res.json({ status: 'success', data: { cupon } });
});

export const deleteCoupon = asyncHandler(async (req: Request, res: Response) => {
  await couponService.remove(req.params.id as string);
  res.status(204).send();
});

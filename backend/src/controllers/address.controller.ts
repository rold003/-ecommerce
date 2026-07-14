import { Request, Response } from 'express';
import { addressService } from '../services/address.service';
import { asyncHandler } from '../utils/asyncHandler';

export const listAddresses = asyncHandler(async (req: Request, res: Response) => {
  const direcciones = await addressService.list(req.user!.sub);
  res.json({ status: 'success', data: { direcciones } });
});

export const createAddress = asyncHandler(async (req: Request, res: Response) => {
  const direccion = await addressService.create(req.user!.sub, req.body);
  res.status(201).json({ status: 'success', data: { direccion } });
});

export const updateAddress = asyncHandler(async (req: Request, res: Response) => {
  const direccion = await addressService.update(req.params.id as string, req.user!.sub, req.body);
  res.json({ status: 'success', data: { direccion } });
});

export const deleteAddress = asyncHandler(async (req: Request, res: Response) => {
  await addressService.remove(req.params.id as string, req.user!.sub);
  res.status(204).send();
});

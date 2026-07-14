import { Request, Response } from 'express';
import { adminService } from '../services/admin.service';
import { asyncHandler } from '../utils/asyncHandler';
import type { ListUsersQuery, SalesReportQuery } from '../validators/admin.validator';

export const getDashboard = asyncHandler(async (_req: Request, res: Response) => {
  const dashboard = await adminService.getDashboard();
  res.json({ status: 'success', data: dashboard });
});

export const getSalesReport = asyncHandler(async (req: Request, res: Response) => {
  const { desde, hasta } = req.validated?.query as SalesReportQuery;
  const reporte = await adminService.getSalesReport(desde, hasta);
  res.json({ status: 'success', data: reporte });
});

export const listUsers = asyncHandler(async (req: Request, res: Response) => {
  const query = (req.validated?.query ?? {}) as ListUsersQuery;
  const { items, meta } = await adminService.listUsers(query);
  res.json({ status: 'success', data: items, meta });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const usuario = await adminService.updateUser(req.params.id as string, req.body, req.user!.sub);
  res.json({ status: 'success', data: { usuario } });
});

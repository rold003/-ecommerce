import { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { isProduction } from '../config/env';
import { AppError } from '../utils/AppError';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      status: 'error',
      message: 'Datos inválidos',
      errors: err.flatten().fieldErrors,
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = (err.meta?.target as string[] | undefined)?.join(', ') ?? 'campo único';
      res.status(409).json({ status: 'error', message: `Ya existe un registro con ese valor: ${target}` });
      return;
    }
    if (err.code === 'P2025') {
      res.status(404).json({ status: 'error', message: 'Registro no encontrado' });
      return;
    }
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ status: 'error', message: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({
    status: 'error',
    message: isProduction ? 'Error interno del servidor' : (err as Error).message,
  });
}

import { NextFunction, Request, Response } from 'express';
import type { Rol } from '@prisma/client';
import { AppError } from '../utils/AppError';
import { verifyAccessToken, AccessTokenPayload } from '../utils/jwt';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const token = req.cookies?.accessToken as string | undefined;
  if (!token) {
    next(new AppError('No autenticado', 401));
    return;
  }

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next(new AppError('Sesión expirada o inválida', 401));
  }
}

export function authorize(...roles: Rol[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.rol)) {
      next(new AppError('No tienes permisos para esta acción', 403));
      return;
    }
    next();
  };
}

import { CookieOptions, Response } from 'express';
import { env, isProduction } from '../config/env';
import { msFromExpiresIn } from './ms';

// SameSite=None es obligatorio cuando frontend y backend viven en dominios
// distintos (ej. *.vercel.app y *.onrender.com, sin dominio propio) para que
// el navegador mande la cookie en llamadas cross-site; requiere Secure=true,
// que ya aplica en produccion. En desarrollo 'lax' es mas simple y no exige
// HTTPS local.
const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  domain: env.COOKIE_DOMAIN === 'localhost' ? undefined : env.COOKIE_DOMAIN,
  path: '/',
};

export function setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
  res.cookie('accessToken', accessToken, {
    ...baseCookieOptions,
    maxAge: msFromExpiresIn(env.JWT_ACCESS_EXPIRES_IN),
  });
  res.cookie('refreshToken', refreshToken, {
    ...baseCookieOptions,
    maxAge: msFromExpiresIn(env.JWT_REFRESH_EXPIRES_IN),
  });
}

export function clearAuthCookies(res: Response): void {
  res.clearCookie('accessToken', baseCookieOptions);
  res.clearCookie('refreshToken', baseCookieOptions);
}

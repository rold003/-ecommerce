import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import type { Rol } from '@prisma/client';

export interface AccessTokenPayload {
  sub: string;
  rol: Rol;
}

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
}

export function signRefreshToken(payload: AccessTokenPayload): string {
  // jti aleatorio: sin esto, dos refresh tokens emitidos para el mismo usuario
  // dentro del mismo segundo (iat con granularidad de segundos) son
  // byte-identicos, lo que choca contra la restriccion unique(tokenHash) en
  // la base de datos y rompe login/register con un 500.
  return jwt.sign({ ...payload, jti: crypto.randomUUID() }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

export function verifyRefreshToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as AccessTokenPayload;
}

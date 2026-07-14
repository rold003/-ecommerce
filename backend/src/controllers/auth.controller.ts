import { Request, Response } from 'express';
import { userRepository } from '../repositories/user.repository';
import { authService } from '../services/auth.service';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import { clearAuthCookies, setAuthCookies } from '../utils/cookies';
import { toPublicUser } from '../utils/serializers';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { usuario, accessToken, refreshToken } = await authService.register(req.body);
  setAuthCookies(res, accessToken, refreshToken);
  res.status(201).json({ status: 'success', data: { usuario: toPublicUser(usuario) } });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { usuario, accessToken, refreshToken } = await authService.login(req.body);
  setAuthCookies(res, accessToken, refreshToken);
  res.json({ status: 'success', data: { usuario: toPublicUser(usuario) } });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken as string | undefined;
  if (!token) throw new AppError('No hay sesión activa', 401);

  const { usuario, accessToken, refreshToken } = await authService.refresh(token);
  setAuthCookies(res, accessToken, refreshToken);
  res.json({ status: 'success', data: { usuario: toPublicUser(usuario) } });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken as string | undefined;
  await authService.logout(token);
  clearAuthCookies(res);
  res.json({ status: 'success', message: 'Sesión cerrada correctamente' });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const usuario = await userRepository.findById(req.user!.sub);
  if (!usuario) throw new AppError('Usuario no encontrado', 404);
  res.json({ status: 'success', data: { usuario: toPublicUser(usuario) } });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  await authService.forgotPassword(req.body.email);
  res.json({
    status: 'success',
    message: 'Si el correo existe en nuestro sistema, recibirás instrucciones para recuperar tu contraseña',
  });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  await authService.resetPassword(req.body.token, req.body.password);
  res.json({ status: 'success', message: 'Contraseña actualizada correctamente' });
});

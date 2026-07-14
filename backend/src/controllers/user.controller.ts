import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { asyncHandler } from '../utils/asyncHandler';
import { clearAuthCookies } from '../utils/cookies';
import { toPublicUser } from '../utils/serializers';

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const usuario = await userService.updateProfile(req.user!.sub, req.body);
  res.json({ status: 'success', data: { usuario: toPublicUser(usuario) } });
});

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  await userService.changePassword(req.user!.sub, req.body.currentPassword, req.body.newPassword);
  clearAuthCookies(res);
  res.json({
    status: 'success',
    message: 'Contraseña actualizada. Por seguridad, vuelve a iniciar sesión.',
  });
});

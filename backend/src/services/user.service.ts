import bcrypt from 'bcrypt';
import { refreshTokenRepository } from '../repositories/refreshToken.repository';
import { userRepository } from '../repositories/user.repository';
import { AppError } from '../utils/AppError';

const BCRYPT_ROUNDS = 12;

interface UpdateProfileInput {
  nombre?: string;
  apellido?: string;
  telefono?: string | null;
  avatarUrl?: string | null;
}

export const userService = {
  updateProfile(usuarioId: string, data: UpdateProfileInput) {
    return userRepository.update(usuarioId, data);
  },

  async changePassword(usuarioId: string, currentPassword: string, newPassword: string): Promise<void> {
    const usuario = await userRepository.findById(usuarioId);
    if (!usuario) throw new AppError('Usuario no encontrado', 404);

    const passwordValida = await bcrypt.compare(currentPassword, usuario.passwordHash);
    if (!passwordValida) throw new AppError('La contraseña actual es incorrecta', 401);

    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    await userRepository.updatePassword(usuarioId, passwordHash);
    // Se cierra la sesión en todos los dispositivos por seguridad tras cambiar la contraseña.
    await refreshTokenRepository.revokeAllForUser(usuarioId);
  },
};

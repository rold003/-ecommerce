import crypto from 'crypto';
import bcrypt from 'bcrypt';
import type { Usuario } from '@prisma/client';
import { env } from '../config/env';
import { prisma } from '../database/prisma';
import { passwordResetTokenRepository } from '../repositories/passwordResetToken.repository';
import { refreshTokenRepository } from '../repositories/refreshToken.repository';
import { userRepository } from '../repositories/user.repository';
import { AppError } from '../utils/AppError';
import { sendEmail } from '../utils/email';
import { sha256 } from '../utils/hash';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { msFromExpiresIn } from '../utils/ms';
import type { LoginInput, RegisterInput } from '../validators/auth.validator';

const BCRYPT_ROUNDS = 12;

function buildTokens(usuario: Pick<Usuario, 'id' | 'rol'>) {
  const payload = { sub: usuario.id, rol: usuario.rol };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
}

async function persistRefreshToken(usuarioId: string, refreshToken: string): Promise<void> {
  const expiresAt = new Date(Date.now() + msFromExpiresIn(env.JWT_REFRESH_EXPIRES_IN));
  await refreshTokenRepository.create(usuarioId, sha256(refreshToken), expiresAt);
}

function frontendUrl(): string {
  return (env.CORS_ORIGIN.split(',')[0] ?? env.CORS_ORIGIN).trim();
}

export const authService = {
  async register(input: RegisterInput) {
    const existente = await userRepository.findByEmail(input.email);
    if (existente) {
      throw new AppError('Ya existe una cuenta con ese correo', 409);
    }

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
    const usuario = await userRepository.createWithCart({
      nombre: input.nombre,
      apellido: input.apellido,
      email: input.email,
      passwordHash,
    });

    const tokens = buildTokens(usuario);
    await persistRefreshToken(usuario.id, tokens.refreshToken);

    sendEmail({
      to: usuario.email,
      subject: 'Bienvenido a la tienda',
      html: `<p>Hola ${usuario.nombre}, gracias por registrarte en nuestra tienda.</p>`,
    }).catch((err: unknown) => console.error('Error enviando email de bienvenida:', err));

    return { usuario, ...tokens };
  },

  async login(input: LoginInput) {
    const usuario = await userRepository.findByEmail(input.email);
    if (!usuario || !usuario.activo) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const passwordValida = await bcrypt.compare(input.password, usuario.passwordHash);
    if (!passwordValida) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const tokens = buildTokens(usuario);
    await persistRefreshToken(usuario.id, tokens.refreshToken);
    return { usuario, ...tokens };
  },

  async refresh(refreshToken: string) {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError('Refresh token inválido', 401);
    }

    const tokenHash = sha256(refreshToken);
    const almacenado = await refreshTokenRepository.findValidByHash(tokenHash);
    if (!almacenado) {
      throw new AppError('Sesión expirada, inicia sesión de nuevo', 401);
    }

    const usuario = await userRepository.findById(payload.sub);
    if (!usuario || !usuario.activo) {
      throw new AppError('Usuario no encontrado', 401);
    }

    // Rotación: se revoca el refresh token usado y se emite un par nuevo.
    await refreshTokenRepository.revoke(almacenado.id);
    const tokens = buildTokens(usuario);
    await persistRefreshToken(usuario.id, tokens.refreshToken);

    return { usuario, ...tokens };
  },

  async logout(refreshToken?: string): Promise<void> {
    if (!refreshToken) return;
    const almacenado = await refreshTokenRepository.findValidByHash(sha256(refreshToken));
    if (almacenado) await refreshTokenRepository.revoke(almacenado.id);
  },

  async forgotPassword(email: string): Promise<void> {
    const usuario = await userRepository.findByEmail(email);
    // No se revela si el correo existe o no, para evitar enumeración de usuarios.
    if (!usuario) return;

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = sha256(rawToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await passwordResetTokenRepository.create(usuario.id, tokenHash, expiresAt);

    const resetUrl = `${frontendUrl()}/recuperar-password?token=${rawToken}`;
    await sendEmail({
      to: usuario.email,
      subject: 'Recupera tu contraseña',
      html: `<p>Haz clic <a href="${resetUrl}">aquí</a> para restablecer tu contraseña. El enlace expira en 1 hora. Si no solicitaste esto, ignora el mensaje.</p>`,
    });
  },

  async resetPassword(rawToken: string, newPassword: string): Promise<void> {
    const tokenHash = sha256(rawToken);
    const almacenado = await passwordResetTokenRepository.findValidByHash(tokenHash);
    if (!almacenado) {
      throw new AppError('Token inválido o expirado', 400);
    }

    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

    await prisma.$transaction([
      prisma.usuario.update({ where: { id: almacenado.usuarioId }, data: { passwordHash } }),
      prisma.passwordResetToken.update({ where: { id: almacenado.id }, data: { usado: true } }),
      prisma.refreshToken.updateMany({
        where: { usuarioId: almacenado.usuarioId },
        data: { revocado: true },
      }),
    ]);
  },
};

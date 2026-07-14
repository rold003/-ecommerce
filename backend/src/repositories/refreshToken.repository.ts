import { prisma } from '../database/prisma';

export const refreshTokenRepository = {
  create(usuarioId: string, tokenHash: string, expiresAt: Date) {
    return prisma.refreshToken.create({ data: { usuarioId, tokenHash, expiresAt } });
  },

  findValidByHash(tokenHash: string) {
    return prisma.refreshToken.findFirst({
      where: { tokenHash, revocado: false, expiresAt: { gt: new Date() } },
    });
  },

  revoke(id: string) {
    return prisma.refreshToken.update({ where: { id }, data: { revocado: true } });
  },

  revokeAllForUser(usuarioId: string) {
    return prisma.refreshToken.updateMany({ where: { usuarioId }, data: { revocado: true } });
  },
};

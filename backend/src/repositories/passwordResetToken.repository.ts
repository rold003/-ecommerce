import { prisma } from '../database/prisma';

export const passwordResetTokenRepository = {
  create(usuarioId: string, tokenHash: string, expiresAt: Date) {
    return prisma.passwordResetToken.create({ data: { usuarioId, tokenHash, expiresAt } });
  },

  findValidByHash(tokenHash: string) {
    return prisma.passwordResetToken.findFirst({
      where: { tokenHash, usado: false, expiresAt: { gt: new Date() } },
    });
  },

  markAsUsed(id: string) {
    return prisma.passwordResetToken.update({ where: { id }, data: { usado: true } });
  },
};

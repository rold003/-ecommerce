import { z } from 'zod';
import { passwordSchema } from './common.validator';

export const updateProfileSchema = z.object({
  body: z.object({
    nombre: z.string().trim().min(2, 'El nombre es muy corto').max(50).optional(),
    apellido: z.string().trim().min(2, 'El apellido es muy corto').max(50).optional(),
    telefono: z.string().trim().min(7).max(20).optional().nullable(),
    avatarUrl: z.string().url('URL de avatar inválida').optional().nullable(),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
    newPassword: passwordSchema,
  }),
});

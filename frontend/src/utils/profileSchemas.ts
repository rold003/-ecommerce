import { z } from 'zod';

export const profileSchema = z.object({
  nombre: z.string().trim().min(2, 'Muy corto'),
  apellido: z.string().trim().min(2, 'Muy corto'),
  telefono: z.string().trim().optional().or(z.literal('')),
});
export type ProfileFormValues = z.infer<typeof profileSchema>;

const passwordSchema = z
  .string()
  .min(8, 'Debe tener al menos 8 caracteres')
  .regex(/[a-z]/, 'Debe incluir una minúscula')
  .regex(/[A-Z]/, 'Debe incluir una mayúscula')
  .regex(/[0-9]/, 'Debe incluir un número');

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Requerido'),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

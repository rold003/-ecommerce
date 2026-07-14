import { z } from 'zod';
import { passwordSchema } from './common.validator';

export const registerSchema = z.object({
  body: z.object({
    nombre: z.string().trim().min(2, 'El nombre es muy corto').max(50),
    apellido: z.string().trim().min(2, 'El apellido es muy corto').max(50),
    email: z.string().trim().toLowerCase().email('Correo inválido'),
    password: passwordSchema,
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().email('Correo inválido'),
    password: z.string().min(1, 'La contraseña es requerida'),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().email('Correo inválido'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Token requerido'),
    password: passwordSchema,
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];

import { beforeEach, describe, expect, it } from 'vitest';
import { prisma } from '../../src/database/prisma';
import { authService } from '../../src/services/auth.service';
import { AppError } from '../../src/utils/AppError';

const registerInput = {
  nombre: 'Ana',
  apellido: 'Lopez',
  email: 'ana@test.local',
  password: 'Password123',
};

describe('authService.register', () => {
  it('crea el usuario con su carrito y devuelve tokens', async () => {
    const resultado = await authService.register(registerInput);

    expect(resultado.usuario.email).toBe(registerInput.email);
    expect(resultado.accessToken).toBeTruthy();
    expect(resultado.refreshToken).toBeTruthy();

    // La contraseña nunca debe quedar en texto plano.
    expect(resultado.usuario.passwordHash).not.toBe(registerInput.password);

    const carrito = await prisma.carrito.findUnique({ where: { usuarioId: resultado.usuario.id } });
    expect(carrito).not.toBeNull();
  });

  it('rechaza un registro con un correo ya usado', async () => {
    await authService.register(registerInput);

    await expect(authService.register(registerInput)).rejects.toMatchObject({
      statusCode: 409,
    } satisfies Partial<AppError>);
  });
});

describe('authService.login', () => {
  beforeEach(async () => {
    await authService.register(registerInput);
  });

  it('permite iniciar sesion con las credenciales correctas', async () => {
    const resultado = await authService.login({ email: registerInput.email, password: registerInput.password });
    expect(resultado.usuario.email).toBe(registerInput.email);
    expect(resultado.accessToken).toBeTruthy();
  });

  it('rechaza una contrasena incorrecta', async () => {
    await expect(
      authService.login({ email: registerInput.email, password: 'ContraseñaIncorrecta1' }),
    ).rejects.toMatchObject({ statusCode: 401 } satisfies Partial<AppError>);
  });

  it('rechaza un correo que no existe', async () => {
    await expect(
      authService.login({ email: 'noexiste@test.local', password: registerInput.password }),
    ).rejects.toMatchObject({ statusCode: 401 } satisfies Partial<AppError>);
  });

  it('rechaza el login de un usuario desactivado', async () => {
    await prisma.usuario.update({ where: { email: registerInput.email }, data: { activo: false } });

    await expect(
      authService.login({ email: registerInput.email, password: registerInput.password }),
    ).rejects.toMatchObject({ statusCode: 401 } satisfies Partial<AppError>);
  });
});

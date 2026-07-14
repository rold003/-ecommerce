import crypto from 'crypto';

// Para hashear tokens de un solo uso (refresh tokens, reset de contraseña) antes de
// guardarlos en la base de datos: si la BD se filtra, los tokens no son reutilizables.
export function sha256(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

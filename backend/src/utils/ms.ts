const UNIT_MULTIPLIERS: Record<string, number> = {
  s: 1000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
};

// Convierte expresiones tipo "15m", "7d" (formato usado por jsonwebtoken) a milisegundos.
export function msFromExpiresIn(expiresIn: string): number {
  const match = /^(\d+)([smhd])$/.exec(expiresIn);
  if (!match) return 15 * 60 * 1000;
  const [, value, unit] = match;
  return Number(value) * (UNIT_MULTIPLIERS[unit as string] ?? 60_000);
}

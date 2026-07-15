export function formatPrice(value: string | number): string {
  return new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(Number(value));
}

export interface Cupon {
  id: string;
  codigo: string;
  tipo: 'PORCENTAJE' | 'MONTO_FIJO';
  valor: string;
  fechaInicio: string;
  fechaFin: string;
  usoMaximo: number | null;
  usosActuales: number;
  montoMinimo: string | null;
  activo: boolean;
}
